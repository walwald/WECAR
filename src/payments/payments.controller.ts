import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { TossKeyDto } from './dto/toss-key.dto';
import { UserAuthGuard } from 'src/auth/security';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  createPayment(@Body() { bookingUuid, method }: PaymentDto) {
    return this.paymentsService.createPayment(bookingUuid, method);
  }

  @Post('toss')
  @UseGuards(UserAuthGuard)
  completeTossPayment(@Body() tossKey: TossKeyDto) {
    return this.paymentsService.completeTossPayment(tossKey);
  }
}
