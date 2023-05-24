import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CarFilterDto {
  @IsOptional()
  @IsString()
  readonly address: string;
  //순서 중요
  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @IsOptional()
  @IsDateString()
  readonly endDate: Date;

  @IsOptional()
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
  @IsNumber()
  readonly minPrice: number;

  @IsOptional()
  @IsNumber()
  readonly maxPrice: number;

  @IsOptional()
  @IsNumber()
  readonly capacity: number;

  //transform 단일이냐 배열이냐를 체크해서 배열로 치환
  @IsOptional()
  readonly options: string[];
}
