import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from '../../infra/database/schemas/user.schema';
import { Kid } from '../../infra/database/schemas/kid.schema';
import { UserRegistrationRequest } from '../../infra/database/schemas/user-registration-request.schema';
import { AuthService } from '../auth/auth.service';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from '../notifications/notifications.service';
import { UserCascadeService } from './user-cascade.service';
import { UserRole, UserStatus } from '@grow-fitness/shared-types';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;
  let mockKidModel: any;
  let mockUserRegistrationRequestModel: any;
  let mockAuthService: any;
  let mockAuditService: any;
  let mockNotificationService: any;
  let mockUserCascadeService: any;

  beforeEach(async () => {
    mockUserModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ data: [], total: [{ count: 0 }] }]),
      }),
    };

    mockKidModel = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUserRegistrationRequestModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockAuthService = {
      hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
    };

    mockAuditService = {
      log: jest.fn().mockResolvedValue({}),
    };

    mockNotificationService = {
      createNotification: jest.fn(),
      sendRegistrationApproved: jest.fn(),
    };

    mockUserCascadeService = {
      deleteParentHard: jest.fn(),
      deleteCoachHard: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Kid.name),
          useValue: mockKidModel,
        },
        {
          provide: getModelToken(UserRegistrationRequest.name),
          useValue: mockUserRegistrationRequestModel,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: UserCascadeService,
          useValue: mockUserCascadeService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findParents', () => {
    it('does not hide unapproved parents when all statuses are requested', async () => {
      await service.findParents({ page: 1, limit: 10 } as any);

      const pipeline = mockUserModel.aggregate.mock.calls[0][0];
      expect(pipeline[0]).toEqual({
        $match: {
          $and: [{ role: UserRole.PARENT }, { status: { $ne: UserStatus.DELETED } }],
        },
      });
      expect(JSON.stringify(pipeline[0])).not.toContain('isApproved');
    });

    it('applies active and inactive filters on top of the non-deleted parent base query', async () => {
      await service.findParents(
        { page: 1, limit: 10 } as any,
        undefined,
        undefined,
        UserStatus.INACTIVE
      );

      const pipeline = mockUserModel.aggregate.mock.calls[0][0];
      expect(pipeline[0]).toEqual({
        $match: {
          $and: [
            { role: UserRole.PARENT },
            { status: { $ne: UserStatus.DELETED } },
            { status: UserStatus.INACTIVE },
          ],
        },
      });
      expect(JSON.stringify(pipeline[0])).not.toContain('isApproved');
    });

    it('sorts parents before pagination inside the data facet', async () => {
      await service.findParents(
        { page: 2, limit: 25 } as any,
        undefined,
        undefined,
        undefined,
        'name',
        'desc'
      );

      const pipeline = mockUserModel.aggregate.mock.calls[0][0];
      const dataFacet = pipeline.find((stage: any) => stage.$facet).$facet.data;
      expect(dataFacet).toEqual([
        { $sort: { 'parentProfile.name': -1, _id: 1 } },
        { $skip: 25 },
        { $limit: 25 },
      ]);
    });
  });
});
