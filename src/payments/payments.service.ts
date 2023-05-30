import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Payment, TossCard } from './entities';
import { EntityManager, Repository } from 'typeorm';
import { Booking } from 'src/bookings/entities';
import { PaymentStatusEnum } from 'src/enums/payment.enum';
import { TossKeyDto } from './dto/toss-key.dto';
import { BookingStatusEnum } from 'src/enums/booking.enum';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    private httpService: HttpService,
  ) {}

  async createPayment(bookingUuid: string, method: string): Promise<Payment> {
    try {
      const booking = await this.bookingRepository.findOneBy({
        uuid: bookingUuid,
      });

      if (!booking) throw new NotFoundException('Invalid Booking uuid');

      const paymentEntry = this.paymentRepository.create({
        booking,
        method,
        status: { id: PaymentStatusEnum.WAITING },
      });

      await this.paymentRepository.save(paymentEntry);

      return paymentEntry;
    } catch (err) {
      throw new BadRequestException('One Payment for One Booking');
    }
  }

  async completeTossPayment(tossKey: TossKeyDto) {
    let response;
    await this.entityManager.transaction(async (entityManager) => {
      const payment = await this.paymentRepository.findOneBy({
        booking: { uuid: tossKey.orderId },
      });

      await entityManager.update(
        Payment,
        { booking: { uuid: tossKey.orderId } },
        { id: payment.id, status: { id: PaymentStatusEnum.SUCCESS } },
      );

      await entityManager.update(
        Booking,
        { uuid: tossKey.orderId },
        { uuid: tossKey.orderId, status: { id: BookingStatusEnum.BOOKED } },
      );

      const encodedKey = Buffer.from(`${tossKey.paymentKey}:`).toString(
        'base64',
      );

      const options = {
        method: 'POST',
        url: 'https://api.tosspayments.com/v1/payments/confirm',
        headers: {
          Authorization: `${encodedKey}`,
          'Content-Type': 'application/json',
        },
        data: {
          paymentKey: tossKey.paymentKey,
          amount: tossKey.amount,
          orderId: tossKey.orderId,
        },
      };

      try {
        response = this.httpService.request(options);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        throw new AxiosError('Toss Connection Error');
      }
    });

    return response.data;
    // axios의 결과값(response)를 우리 어딘가 디비에 저장(고객 결제 영수증이니까)
  }
}
