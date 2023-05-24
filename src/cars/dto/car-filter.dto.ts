import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  isArray,
} from 'class-validator';

export class CarFilterDto {
  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @IsOptional()
  @IsDateString()
  readonly endDate: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly minCapacity: number;

  @IsOptional()
  @IsString()
  readonly brand: string;

  @IsOptional()
  @IsString()
  readonly engineSize: string;

  @IsOptional()
  @IsString()
  readonly carType: string;

  @IsOptional()
  @IsString()
  readonly fuelType: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly minPrice: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly maxPrice: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly capacity: number;

  @IsOptional()
  @Transform(({ value }) => (!isArray(value) ? [value] : value))
  @IsArray()
  readonly options: string[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly page: number;
}
