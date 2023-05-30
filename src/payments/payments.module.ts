import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment, PaymentLog, PaymentStatus } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, PaymentStatus, PaymentLog])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
