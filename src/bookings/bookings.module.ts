import { Module, forwardRef } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingLog } from './entities';
import { BookingStatus } from './entities/booking-status.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostCar } from 'src/cars/entities';
import { ScheduleModule } from '@nestjs/schedule';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingStatus, BookingLog, HostCar]),
    ScheduleModule.forRoot(),
    forwardRef(() => UtilsModule),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
