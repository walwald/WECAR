import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities';
import { v4 as uuid } from 'uuid';
import { BookingDto } from './dto/booking.dto';
import { BookingStatusEnum, CommissionEnum } from 'src/bookings/booking.enum';
import { HostCar } from 'src/cars/entities';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(HostCar)
    private hostCarRepository: Repository<HostCar>,
    @Inject(forwardRef(() => UtilsService))
    private utilsService: UtilsService,
    @InjectRepository(BookingStatus)
    private bookingStatusRepository: Repository<BookingStatus>,
  ) {}

  async getBookingStatus(statusMessage: string): Promise<BookingStatus> {
    const status = await this.bookingStatusRepository.findOneBy({
      name: BookingStatusEnum[statusMessage],
    });
    if (!status) throw new NotFoundException('Booking Status is Undefined');
    return status;
  }

  //find 에서 lock을 걸 수 있음 entityManager로. 생성 주기에는 접근 불가
  //수수료 확인 logic - rate 바뀌면 오류 나도록
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

    if (
      bookingInfo.totalPrice * CommissionEnum.RATE !==
      bookingInfo.commission
    ) {
      throw new BadRequestException('Wrong Commission Amount');
    }

    const status = await this.getBookingStatus('PROCESSING');
    const bookingEntry = this.bookingRepository.create({
      ...bookingInfo,
      startDate: newStartDate,
      endDate: newEndDate,
      uuid: uuid(),
      hostCar: { id: hostCarId },
      user: { id: userId },
      status,
    });

    await this.bookingRepository.save(bookingEntry);
    return bookingEntry;
  }

  async getBookingInfo(uuid: string, userId: number): Promise<Booking> {
    const bookingInfo = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.hostCar', 'hostCar')
      .leftJoinAndSelect('hostCar.files', 'files')
      .leftJoinAndSelect('hostCar.carModel', 'carModel')
      .leftJoinAndSelect('carModel.brand', 'brand')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.uuid = :uuid', { uuid })
      .andWhere('user.id = :userId', { userId })
      .select([
        'booking',
        'carModel.name',
        'brand.name',
        'user.name',
        'user.phoneNumber',
        'hostCar.pricePerDay',
        'files.url',
      ])
      .getOne();

    if (!bookingInfo)
      throw new NotFoundException('Invalid User or Booking uuid');

    bookingInfo.startDate = this.utilsService.makeKrDate(bookingInfo.startDate);
    bookingInfo.endDate = this.utilsService.makeKrDate(bookingInfo.endDate);

    return bookingInfo;
  }

  //paging 추가
  async getBookingsByHost(hostId: number): Promise<Booking[]> {
    const bookingList = await this.bookingRepository.find({
      where: { hostCar: { host: { id: hostId } } },
      relations: { user: true, status: true },
      order: { createdAt: 'DESC' },
      select: {
        uuid: true,
        commission: true,
        createdAt: true,
        endDate: true,
        startDate: true,
        status: { name: true },
        totalPrice: true,
        user: { name: true, phoneNumber: true },
      },
    });

    bookingList.forEach((booking) => {
      booking.startDate = this.utilsService.makeKrDate(booking.startDate);
      booking.endDate = this.utilsService.makeKrDate(booking.endDate);
    });

    return bookingList;
  }
}
