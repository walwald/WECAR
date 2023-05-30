import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TossKeyDto {
  @IsString()
  @IsNotEmpty()
  readonly paymentKey: string;

  @IsString()
  @IsNotEmpty()
  readonly orderId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
