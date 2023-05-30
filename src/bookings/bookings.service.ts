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
import { Cron } from '@nestjs/schedule';

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

  async getRecentBooking(hostCarId: number, userId: number): Promise<Booking> {
    const bookingInfo = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hostCar', 'hostCar')
      .leftJoinAndSelect('hostCar.files', 'files')
      .leftJoinAndSelect('hostCar.carModel', 'carModel')
      .leftJoinAndSelect('carModel.brand', 'brand')
      .leftJoinAndSelect('booking.user', 'user')
      .where('hostCar.id = :hostCarId', { hostCarId })
      .andWhere('user.id = :userId', { userId })
      .select([
        'booking',
        'carModel.name',
        'brand.name',
        'user.name',
        'user.phoneNumber',
        'hostCar.pricePerDay',
      ])
      .orderBy('booking.createdAt', 'DESC')
      .getOne();

    if (!bookingInfo)
      throw new NotFoundException('Invalid User or Host Car Id');

    return bookingInfo;
  }

  async getBookingsByHost(hostId: number): Promise<Booking[]> {
    const bookingList = await this.bookingRepository.find({
      where: { hostCar: { host: { id: hostId } } },
      order: { createdAt: 'DESC' },
    });

    return bookingList;
  }

  @Cron('0 0 * * *')
  async updateBookingStatus(): Promise<void> {
    const allBookings = await this.bookingRepository.find();
    const now = new Date();
    allBookings.forEach((booking) => {
      const bookingEndDate = new Date(booking.endDate);
      if (now > bookingEndDate) {
        this.bookingRepository.update(
          { uuid: booking.uuid },
          { status: { id: BookingStatusEnum.RETURNTIME } },
        );
      }
    });
    return;
  }

  async deleteRecentBooking(hostCarId: number, userId: number): Promise<any> {
    const bookingInfo = await this.bookingRepository.delete({
      hostCar: { id: hostCarId },
      user: { id: userId },
      status: { id: BookingStatusEnum.PROCESSING },
    });

    if (!bookingInfo)
      throw new NotFoundException('Invalid User or Host Car Id');

    return bookingInfo;
  }
}
