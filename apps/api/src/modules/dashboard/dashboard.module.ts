import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SessionsModule } from '../sessions/sessions.module';
import { RequestsModule } from '../requests/requests.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { AuditModule } from '../audit/audit.module';
import { User, UserSchema } from '../../infra/database/schemas/user.schema';
import { Kid, KidSchema } from '../../infra/database/schemas/kid.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Kid.name, schema: KidSchema },
    ]),
    SessionsModule,
    RequestsModule,
    InvoicesModule,
    AuditModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
