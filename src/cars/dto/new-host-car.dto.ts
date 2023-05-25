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

  @IsString()
  @IsNotEmpty()
  carModel: string;

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

  @IsDateString()
  @IsNotEmpty()
  readonly startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly endDate: Date;
}
