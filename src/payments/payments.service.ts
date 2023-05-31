import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Payment, TossInfo } from './entities';
import { EntityManager, Repository } from 'typeorm';
import { Booking } from 'src/bookings/entities';
import { PaymentStatusEnum } from 'src/enums/payment.enum';
import { TossKeyDto } from './dto/toss-key.dto';
import { BookingStatusEnum } from 'src/enums/booking.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(TossInfo)
    private tossInfoRepository: Repository<TossInfo>,
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
    let payment;
    await this.entityManager.transaction(async (entityManager) => {
      payment = await this.paymentRepository.findOneBy({
        booking: { uuid: tossKey.orderId },
      });

      if (!payment) throw new NotFoundException('Create Payment First');

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

      const encodedKey = Buffer.from(
        `test_sk_O6BYq7GWPVvZLZ1W5klVNE5vbo1d:`,
      ).toString('base64');

      const options = {
        method: 'POST',
        url: 'https://api.tosspayments.com/v1/payments/confirm',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encodedKey}`,
        },
        data: {
          paymentKey: tossKey.paymentKey,
          amount: tossKey.amount,
          orderId: tossKey.orderId,
        },
      };
      try {
        response = await firstValueFrom(this.httpService.request(options));
      } catch (error) {
        console.error(error);
        throw new ServiceUnavailableException('Toss Connection Error');
      }
    });

    if (!response.data)
      throw new ServiceUnavailableException('Toss Info Response Error');

    const tossInfoEntry = this.tossInfoRepository.create({
      status: response.data.status,
      currency: response.data.currency,
      requestedAt: response.data.requestedAt,
      approvedAt: response.data.approvedAt,
      totalAmount: response.data.totalAmount,
      vat: response.data.vat,
      method: response.data.method,
      payment: payment,
    });

    return this.tossInfoRepository.save(tossInfoEntry);
  }
}
