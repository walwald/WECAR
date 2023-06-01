import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus, TossInfo } from './entities';
import { EntityManager, Repository } from 'typeorm';
import { Booking } from 'src/bookings/entities';
import { TossKeyDto } from './dto/toss-key.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaymentStatusEnum } from './payment.enum';
import { BookingsService } from 'src/bookings/bookings.service';

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
    @InjectRepository(PaymentStatus)
    private paymentStatusRepository: Repository<PaymentStatus>,
    private bookingsService: BookingsService,
  ) {}

  async getPaymentStatus(statusMessage: string): Promise<PaymentStatus> {
    const status = await this.paymentStatusRepository.findOneBy({
      name: PaymentStatusEnum[statusMessage],
    });
    if (!status) throw new NotFoundException('Booking Status is Undefined');
    return status;
  }

  async createPayment(bookingUuid: string, method: string): Promise<Payment> {
    const booking = await this.bookingRepository.findOneBy({
      uuid: bookingUuid,
    });

    if (!booking) throw new NotFoundException('Invalid Booking uuid');

    const status = await this.getPaymentStatus('WAITING');
    const paymentEntry = this.paymentRepository.create({
      booking,
      method,
      status,
    });

    await this.paymentRepository.save(paymentEntry);

    return paymentEntry;
  }

  async completeTossPayment(tossKey: TossKeyDto) {
    let response;
    let payment;
    await this.entityManager.transaction(async (entityManager) => {
      payment = await this.paymentRepository.findOneBy({
        booking: { uuid: tossKey.orderId },
      });

      if (!payment) throw new NotFoundException('Create Payment First');

      const paymentStatus = await this.getPaymentStatus('SUCCESS');
      await entityManager.update(
        Payment,
        { booking: { uuid: tossKey.orderId } },
        { id: payment.id, status: paymentStatus },
      );

      const bookingStatus = await this.bookingsService.getBookingStatus(
        'BOOKED',
      );
      await entityManager.update(
        Booking,
        { uuid: tossKey.orderId },
        { uuid: tossKey.orderId, status: bookingStatus },
      );

      //환경 변수로 key, domain도 상수로 빼기
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
        //lastValueFrom을 더 많이 씀 - observable
        response = await firstValueFrom(this.httpService.request(options));
      } catch (error) {
        console.error(error);
        //toss에 환불 요청하는 flow 만들기
        throw new ServiceUnavailableException('Toss Connection Error');
      }
    });

    if (!response.data)
      throw new ServiceUnavailableException('Toss Info Response Error');
    //transaction에 포함
    //에러 - 승인 취소 로직
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
