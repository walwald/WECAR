import { IsOptional } from 'class-validator';

export class CarFilterDto {
  @IsOptional()
  readonly address: string;

  @IsOptional()
  readonly startDate: Date;

  @IsOptional()
  readonly endDate: Date;

  @IsOptional()
  readonly minCapacity: number;

  @IsOptional()
  readonly brand: string;

  @IsOptional()
  readonly engineSize: string;

  @IsOptional()
  readonly carType: string;

  @IsOptional()
  readonly fuelType: string;

  @IsOptional()
  readonly minPrice: number;

  @IsOptional()
  readonly maxPrice: number;

  @IsOptional()
  readonly capacity: number;

  @IsOptional()
  readonly options: string[];
}
