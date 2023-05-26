import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class BookingDto {
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  readonly commission: number;
}
