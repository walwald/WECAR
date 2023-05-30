import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  readonly bookingUuid: string;

  @IsString()
  @IsNotEmpty()
  readonly method: string;
}
