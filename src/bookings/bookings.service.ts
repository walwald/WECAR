import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  createBooking(userId: number) {
    this.bookingRepository.create({
      uuid: uuid(),
      user: { id: userId },
      status: { id: 1 },
    });
  }
}
