import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class NewHostCarDto {
  @IsString()
  @IsNotEmpty()
  readonly carNumber: string;

  @IsNumber()
  @IsNotEmpty()
  carModel: number;
  //carModer id 전달 가능?

  @IsString()
  @IsNotEmpty()
  fuelType: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsNumber()
  @IsNotEmpty()
  readonly pricePerDay: number;

  @IsArray()
  readonly options: string[];

  @IsArray()
  readonly fileUrls: string[];

  @IsDateString()
  @IsNotEmpty()
  readonly startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate: Date;
}
