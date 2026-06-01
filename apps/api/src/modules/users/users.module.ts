import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersMeController } from './users-me.controller';
import { UsersMeProfileController } from './users-me-profile.controller';
import { UsersMeCoachProfileController } from './users-me-coach-profile.controller';
import { UsersService } from './users.service';
import { UserCascadeService } from './user-cascade.service';
import { User, UserSchema } from '../../infra/database/schemas/user.schema';
import { Kid, KidSchema } from '../../infra/database/schemas/kid.schema';
import {
  UserRegistrationRequest,
  UserRegistrationRequestSchema,
} from '../../infra/database/schemas/user-registration-request.schema';
import { Session, SessionSchema } from '../../infra/database/schemas/session.schema';
import { Invoice, InvoiceSchema } from '../../infra/database/schemas/invoice.schema';
import { Notification, NotificationSchema } from '../../infra/database/schemas/notification.schema';
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from '../../infra/database/schemas/password-reset-token.schema';
import {
  ExtraSessionRequest,
  ExtraSessionRequestSchema,
} from '../../infra/database/schemas/extra-session-request.schema';
import {
  RescheduleRequest,
  RescheduleRequestSchema,
} from '../../infra/database/schemas/reschedule-request.schema';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Kid.name, schema: KidSchema },
      {
        name: UserRegistrationRequest.name,
        schema: UserRegistrationRequestSchema,
      },
      { name: Session.name, schema: SessionSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Notification.name, schema: NotificationSchema },
      {
        name: PasswordResetToken.name,
        schema: PasswordResetTokenSchema,
      },
      {
        name: ExtraSessionRequest.name,
        schema: ExtraSessionRequestSchema,
      },
      {
        name: RescheduleRequest.name,
        schema: RescheduleRequestSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    AuditModule,
    NotificationsModule,
    GoogleCalendarModule,
  ],
  controllers: [
    UsersController,
    UsersMeController,
    UsersMeProfileController,
    UsersMeCoachProfileController,
  ],
  providers: [UsersService, UserCascadeService],
  exports: [UsersService],
})
export class UsersModule {}
