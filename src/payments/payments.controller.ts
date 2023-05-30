import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { PaymentDto } from './dto/payment.dto';
import { TossKeyDto } from './dto/toss-key.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt-user'))
  createPayment(@Body() { bookingUuid, method }: PaymentDto) {
    return this.paymentsService.createPayment(bookingUuid, method);
  }

  @Post('toss')
  @UseGuards(AuthGuard('jwt-user'))
  completeTossPayment(@Body() tossKey: TossKeyDto) {
    return this.paymentsService.completeTossPayment(tossKey);
  }
}
