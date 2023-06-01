import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingDto } from './dto/booking.dto';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/types';
import { Booking } from './entities';
import { HostAuthGuard, UserAuthGuard } from 'src/auth/security';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post(':hostCarId')
  @UseGuards(UserAuthGuard)
  createBooking(
    @Param('hostCarId', ParseIntPipe) hostCarId: number,
    @Body() bookingInfo: BookingDto,
    @User() { id: userId }: ReqUser,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(hostCarId, bookingInfo, userId);
  }

  @Get('list')
  @UseGuards(HostAuthGuard)
  getBookingsByHost(@User() { id: hostId }: ReqUser): Promise<Booking[]> {
    return this.bookingsService.getBookingsByHost(hostId);
  }

  @Get(':uuid')
  @UseGuards(UserAuthGuard)
  getBookingInfo(
    @Param('uuid') uuid: string,
    @User() { id: userId }: ReqUser,
  ): Promise<Booking> {
    return this.bookingsService.getBookingInfo(uuid, userId);
  }
}
