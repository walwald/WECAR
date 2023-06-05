import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment, PaymentLog, PaymentStatus, TossInfo } from './entities';
import { BookingsModule } from 'src/bookings/bookings.module';
import { Booking } from 'src/bookings/entities';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Payment,
      PaymentStatus,
      PaymentLog,
      TossInfo,
      Booking,
    ]),
    BookingsModule,
    HttpModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
