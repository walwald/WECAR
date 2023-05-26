import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities';
import { v4 as uuid } from 'uuid';
import { BookingDto } from './dto/booking.dto';
import { BookingStatusEnum } from 'src/enums/booking.enum';
import { HostCar } from 'src/cars/entities';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(HostCar)
    private hostCarRepository: Repository<HostCar>,
  ) {}

  async createBooking(
    hostCarId: number,
    bookingInfo: BookingDto,
    userId: number,
  ): Promise<Booking> {
    const hostCar = await this.hostCarRepository.findOne({
      where: { id: hostCarId },
      relations: { bookings: true },
    });

    if (!hostCar) throw new NotFoundException('Invalid HostCar');

    const newStartDate = new Date(bookingInfo.startDate);
    const newEndDate = new Date(bookingInfo.endDate);

    hostCar.bookings?.forEach((booking) => {
      if (!(newStartDate > booking.endDate || newEndDate < booking.startDate)) {
        throw new ConflictException('Booking Date Conflicted');
      }
    });

    const bookingEntry = this.bookingRepository.create({
      ...bookingInfo,
      uuid: uuid(),
      hostCar: { id: hostCarId },
      user: { id: userId },
      status: { id: BookingStatusEnum.PROCESSING },
    });

    await this.bookingRepository.save(bookingEntry);
    return bookingEntry;
  }
}
