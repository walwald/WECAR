import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { HostCar } from 'src/cars/entities';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Booking } from 'src/bookings/entities';
import { BookingsService } from 'src/bookings/bookings.service';
import { BookingsModule } from 'src/bookings/bookings.module';

@Injectable()
export class SchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(HostCar)
    private hostCarRepository: Repository<HostCar>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @Inject(forwardRef(() => BookingsService))
    private bookingsService: BookingsService,
  ) {}

  @Cron('0 0 * * *')
  async updateCarStatus(): Promise<void> {
    const allCars = await this.hostCarRepository.find();
    const now = new Date();
    allCars.forEach((car) => {
      const carEndDate = this.utilsService.makeKrDate(car.endDate);
      if (now > carEndDate) {
        this.hostCarRepository.update({ id: car.id }, { status: false });
      }
    });
    return;
  }

  @Cron('0 0 * * *')
  async updateBookingStatus(): Promise<void> {
    const allBookings = await this.bookingRepository.find();
    const now = new Date();
    const status = await this.bookingsService.getBookingStatus('RETURNTIME');
    allBookings.forEach((booking) => {
      const bookingEndDate = this.utilsService.makeKrDate(booking.endDate);
      if (now > bookingEndDate) {
        this.bookingRepository.update({ uuid: booking.uuid }, { status });
      }
    });
    return;
  }
}
