import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { HostCar } from 'src/cars/entities';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { BookingStatusEnum } from 'src/enums/booking.enum';
import { Booking } from 'src/bookings/entities';

@Injectable()
export class SchedulerService {
  constructor(
    private utilsService: UtilsService,
    @InjectRepository(HostCar)
    private hostCarRepository: Repository<HostCar>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
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
    allBookings.forEach((booking) => {
      const bookingEndDate = this.utilsService.makeKrDate(booking.endDate);
      if (now > bookingEndDate) {
        this.bookingRepository.update(
          { uuid: booking.uuid },
          { status: { id: BookingStatusEnum.RETURNTIME } },
        );
      }
    });
    return;
  }
}
