import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LocationsService } from './locations.service';
import { Location } from '../../infra/database/schemas/location.schema';
import { AuditService } from '../audit/audit.service';

function chainableFind(result: unknown[] = []) {
  const chain: any = {
    sort: jest.fn(() => chain),
    skip: jest.fn(() => chain),
    limit: jest.fn(() => chain),
    exec: jest.fn().mockResolvedValue(result),
  };
  return chain;
}

describe('LocationsService', () => {
  let service: LocationsService;
  let findChain: any;
  let locationModel: any;

  beforeEach(async () => {
    findChain = chainableFind();
    locationModel = {
      find: jest.fn(() => findChain),
      countDocuments: jest.fn(() => ({ exec: jest.fn().mockResolvedValue(0) })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: getModelToken(Location.name), useValue: locationModel },
        { provide: AuditService, useValue: { log: jest.fn() } },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('sorts locations before pagination', async () => {
    await service.findAll({ page: 3, limit: 20 } as any, {
      sortBy: 'isActive',
      sortOrder: 'desc',
    });

    expect(findChain.sort).toHaveBeenCalledWith({ isActive: -1, _id: 1 });
    expect(findChain.skip).toHaveBeenCalledWith(40);
    expect(findChain.limit).toHaveBeenCalledWith(20);
  });

  it('applies search and active filters to data and count queries', async () => {
    await service.findAll({ page: 1, limit: 10 } as any, {
      search: 'Main Gym',
      isActive: false,
    });

    const expectedQuery = {
      $or: [
        { name: { $regex: 'Main Gym', $options: 'i' } },
        { address: { $regex: 'Main Gym', $options: 'i' } },
        { placeUrl: { $regex: 'Main Gym', $options: 'i' } },
      ],
      isActive: false,
    };

    expect(locationModel.find).toHaveBeenCalledWith(expectedQuery);
    expect(locationModel.countDocuments).toHaveBeenCalledWith(expectedQuery);
  });
});
