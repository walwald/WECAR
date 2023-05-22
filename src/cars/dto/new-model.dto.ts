import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewModelDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  readonly engineSize: string;

  @IsString()
  @IsNotEmpty()
  readonly carType: string;

  @IsNumber()
  @IsNotEmpty()
  readonly capacity: number;
}
