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
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from 'src/auth/types';
import { Booking } from './entities';

//controller 자체에 guard 설정 가능
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  //param pipe적용
  @Post(':hostCarId')
  @UseGuards(AuthGuard('jwt-user'))
  createBooking(
    @Param('hostCarId', ParseIntPipe) hostCarId: number,
    @Body() bookingInfo: BookingDto,
    @User() { id: userId }: ReqUser,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(hostCarId, bookingInfo, userId);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt-host'))
  getBookingsByHost(@User() { id: hostId }: ReqUser): Promise<Booking[]> {
    return this.bookingsService.getBookingsByHost(hostId);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard('jwt-user'))
  getBookingInfo(
    @Param('uuid') uuid: string,
    @User() { id: userId }: ReqUser,
  ): Promise<Booking> {
    return this.bookingsService.getBookingInfo(uuid, userId);
  }
}
