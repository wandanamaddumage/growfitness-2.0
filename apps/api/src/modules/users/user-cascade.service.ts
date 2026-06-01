import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRole } from '@grow-fitness/shared-types';
import { User, UserDocument } from '../../infra/database/schemas/user.schema';
import { Kid, KidDocument } from '../../infra/database/schemas/kid.schema';
import {
  UserRegistrationRequest,
  UserRegistrationRequestDocument,
} from '../../infra/database/schemas/user-registration-request.schema';
import { Session, SessionDocument } from '../../infra/database/schemas/session.schema';
import { Invoice, InvoiceDocument } from '../../infra/database/schemas/invoice.schema';
import { Notification, NotificationDocument } from '../../infra/database/schemas/notification.schema';
import {
  PasswordResetToken,
  PasswordResetTokenDocument,
} from '../../infra/database/schemas/password-reset-token.schema';
import {
  ExtraSessionRequest,
  ExtraSessionRequestDocument,
} from '../../infra/database/schemas/extra-session-request.schema';
import {
  RescheduleRequest,
  RescheduleRequestDocument,
} from '../../infra/database/schemas/reschedule-request.schema';
import { GoogleCalendarSyncService } from '../google-calendar/google-calendar-sync.service';
import { GoogleCalendarApiService } from '../google-calendar/google-calendar-api.service';
import { AuditService } from '../audit/audit.service';
import { ErrorCode } from '../../common/enums/error-codes.enum';

@Injectable()
export class UserCascadeService {
  private readonly logger = new Logger(UserCascadeService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Kid.name) private kidModel: Model<KidDocument>,
    @InjectModel(UserRegistrationRequest.name)
    private userRegistrationRequestModel: Model<UserRegistrationRequestDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(PasswordResetToken.name)
    private passwordResetTokenModel: Model<PasswordResetTokenDocument>,
    @InjectModel(ExtraSessionRequest.name)
    private extraSessionRequestModel: Model<ExtraSessionRequestDocument>,
    @InjectModel(RescheduleRequest.name)
    private rescheduleRequestModel: Model<RescheduleRequestDocument>,
    private googleCalendarSync: GoogleCalendarSyncService,
    private googleCalendarApi: GoogleCalendarApiService,
    private auditService: AuditService
  ) {}

  private toKidObjectIds(kids?: (Types.ObjectId | string | { _id?: Types.ObjectId })[]): Types.ObjectId[] {
    if (!kids?.length) return [];
    return kids.map(entry => {
      if (entry instanceof Types.ObjectId) return entry;
      if (typeof entry === 'string' && Types.ObjectId.isValid(entry)) {
        return new Types.ObjectId(entry);
      }
      if (entry && typeof entry === 'object' && entry._id) {
        const id = entry._id;
        return id instanceof Types.ObjectId ? id : new Types.ObjectId(String(id));
      }
      return new Types.ObjectId(String(entry));
    });
  }

  async deleteParentHard(id: string, actorId: string): Promise<{ message: string }> {
    const parent = await this.userModel.findOne({ _id: id, role: UserRole.PARENT }).exec();

    if (!parent) {
      throw new NotFoundException({
        errorCode: ErrorCode.USER_NOT_FOUND,
        message: 'Parent not found',
      });
    }

    if (parent.role === UserRole.ADMIN) {
      throw new ForbiddenException({
        errorCode: ErrorCode.FORBIDDEN,
        message: 'Cannot delete administrator accounts.',
      });
    }

    const parentOid = parent._id;
    const parentIdStr = parentOid.toString();

    const kidDocs = await this.kidModel.find({ parentId: parentOid }).select('_id').lean().exec();
    const kidObjectIds = kidDocs.map(k =>
      k._id instanceof Types.ObjectId ? k._id : new Types.ObjectId(String(k._id))
    );

    try {
      await this.googleCalendarApi.purgeAllCalendarEventsAndMappingsForUser(parentIdStr);
    } catch (err) {
      this.logger.warn(`Google Calendar purge failed for parent ${parentIdStr}`, err);
    }

    if (kidObjectIds.length > 0) {
      await this.sessionModel.updateMany({ kids: { $in: kidObjectIds } }, { $pullAll: { kids: kidObjectIds } }).exec();
    }

    const extraCriteria: Record<string, unknown>[] = [{ parentId: parentOid }];
    if (kidObjectIds.length) {
      extraCriteria.push({ kidId: { $in: kidObjectIds } });
    }
    await Promise.all([
      this.extraSessionRequestModel.deleteMany({ $or: extraCriteria }).exec(),
      this.rescheduleRequestModel.deleteMany({ requestedBy: parentOid }).exec(),
      this.userRegistrationRequestModel.deleteMany({ parentId: parentOid }).exec(),
    ]);

    const invoiceRes = await this.invoiceModel.deleteMany({ parentId: parentOid }).exec();

    await Promise.all([
      this.notificationModel.deleteMany({ userId: parentOid }).exec(),
      this.passwordResetTokenModel.deleteMany({ userId: parentOid }).exec(),
      this.kidModel.deleteMany({ parentId: parentOid }).exec(),
    ]);

    const deleted = await this.userModel.findOneAndDelete({
      _id: parentOid,
      role: UserRole.PARENT,
    });

    if (!deleted) {
      throw new NotFoundException({
        errorCode: ErrorCode.USER_NOT_FOUND,
        message: 'Parent not found',
      });
    }

    await this.auditService.log({
      actorId,
      action: 'DELETE_PARENT_HARD',
      entityType: 'User',
      entityId: id,
      metadata: {
        kidCount: kidObjectIds.length,
        invoicesRemoved: invoiceRes.deletedCount ?? 0,
      },
    });

    return { message: 'Parent deleted successfully' };
  }

  async deleteCoachHard(id: string, actorId: string): Promise<{ message: string }> {
    const coach = await this.userModel.findOne({ _id: id, role: UserRole.COACH }).exec();

    if (!coach) {
      throw new NotFoundException({
        errorCode: ErrorCode.USER_NOT_FOUND,
        message: 'Coach not found',
      });
    }

    if (coach.role === UserRole.ADMIN) {
      throw new ForbiddenException({
        errorCode: ErrorCode.FORBIDDEN,
        message: 'Cannot delete administrator accounts.',
      });
    }

    const coachOid = coach._id;
    const coachIdStr = coachOid.toString();

    const sessions = await this.sessionModel
      .find({ coachId: coachOid })
      .select('_id kids')
      .lean()
      .exec();

    for (const session of sessions) {
      const sessionId = String(session._id);
      const kidObjectIds = this.toKidObjectIds(session.kids as any);
      try {
        await this.googleCalendarSync.syncSessionDeleted(sessionId, coachIdStr, kidObjectIds);
      } catch (err) {
        this.logger.warn(`Google Calendar sync failed for session ${sessionId} during coach delete`, err);
      }
    }

    const sessionIds = sessions.map(s => s._id);
    if (sessionIds.length) {
      await this.rescheduleRequestModel.deleteMany({ sessionId: { $in: sessionIds } }).exec();
    }

    const sessionDel = await this.sessionModel.deleteMany({ coachId: coachOid }).exec();
    const invoiceRes = await this.invoiceModel.deleteMany({ coachId: coachOid }).exec();

    await Promise.all([
      this.extraSessionRequestModel.deleteMany({ coachId: coachOid }).exec(),
      this.notificationModel.deleteMany({ userId: coachOid }).exec(),
      this.passwordResetTokenModel.deleteMany({ userId: coachOid }).exec(),
    ]);

    try {
      await this.googleCalendarApi.purgeAllCalendarEventsAndMappingsForUser(coachIdStr);
    } catch (err) {
      this.logger.warn(`Google Calendar purge failed for coach ${coachIdStr}`, err);
    }

    const deleted = await this.userModel.findOneAndDelete({
      _id: coachOid,
      role: UserRole.COACH,
    });

    if (!deleted) {
      throw new NotFoundException({
        errorCode: ErrorCode.USER_NOT_FOUND,
        message: 'Coach not found',
      });
    }

    await this.auditService.log({
      actorId,
      action: 'DELETE_COACH_HARD',
      entityType: 'User',
      entityId: id,
      metadata: {
        sessionCount: sessionDel.deletedCount ?? sessions.length,
        invoiceCount: invoiceRes.deletedCount ?? 0,
      },
    });

    return { message: 'Coach deleted successfully' };
  }
}
