import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities';
import { Repository } from 'typeorm';
import { Booking } from 'src/bookings/entities';
import { PaymentStatusEnum } from 'src/enums/payment.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async createPayment(bookingUuid: string, method: string): Promise<Payment> {
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
  }
}
