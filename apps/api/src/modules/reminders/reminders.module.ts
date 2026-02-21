import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '../../infra/database/schemas/session.schema';
import { Invoice, InvoiceSchema } from '../../infra/database/schemas/invoice.schema';
import { User, UserSchema } from '../../infra/database/schemas/user.schema';
import { Kid, KidSchema } from '../../infra/database/schemas/kid.schema';
import { RemindersService } from './reminders.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
      { name: Kid.name, schema: KidSchema },
    ]),
    NotificationsModule,
  ],
  providers: [RemindersService],
})
export class RemindersModule {}
