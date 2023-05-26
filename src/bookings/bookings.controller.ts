import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingDto } from './dto/booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/types';
import { Booking } from './entities';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post(':hostCarId')
  @UseGuards(AuthGuard('jwt-user'))
  createBooking(
    @Param('hostCarId') hostCarId: number,
    @Body() bookingInfo: BookingDto,
    @User() { id: userId }: ReqUser,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(hostCarId, bookingInfo, userId);
  }
}
