import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingLog } from './entities';
import { BookingStatus } from './entities/booking-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingStatus, BookingLog])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
