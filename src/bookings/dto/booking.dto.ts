import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

//isnotempty 순서 확인
export class BookingDto {
  @IsDateString()
  @IsNotEmpty()
  readonly startDate: string;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate: string;

  @IsNumber()
  @IsNotEmpty()
  readonly totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  readonly commission: number;
}
