import { IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { FileDto } from './file.dto';
import { NewHostCarDto } from './new-host-car.dto';
import { Type } from 'class-transformer';

export class CarRegisterDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => NewHostCarDto)
  newHostCar: NewHostCarDto;

  @IsArray()
  files: FileDto[];
}
