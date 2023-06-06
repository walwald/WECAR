import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class NewHostCarDto {
  @IsNotEmpty()
  @IsString()
  readonly carNumber: string;

  @IsNotEmpty()
  @IsString()
  carModel: string;

  @IsNotEmpty()
  @IsString()
  fuelType: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsNumber()
  readonly pricePerDay: number;

  @IsArray()
  readonly options: string[];

  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  readonly endDate: Date;
}
