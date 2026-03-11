import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../../infra/database/schemas/notification.schema';
import { NotificationService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailProvider } from './providers/email.provider';
import { TextLkProvider } from './providers/textlk.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  controllers: [NotificationsController],
  providers: [NotificationService, EmailProvider, TextLkProvider],
  exports: [NotificationService],
})
export class NotificationsModule {}
