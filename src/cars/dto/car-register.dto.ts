import { IsArray, IsObject } from 'class-validator';
import { FileDto } from './file.dto';
import { NewHostCarDto } from './new-host-car.dto';

export class CarRegisterDto {
  @IsObject()
  newHostCar: NewHostCarDto;

  @IsArray()
  files: FileDto[];
}
