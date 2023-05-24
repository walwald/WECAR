import { FileDto } from './file.dto';
import { NewHostCarDto } from './new-host-car.dto';

export class CarRegisterDto {
  readonly newHostCar: NewHostCarDto;
  readonly files: FileDto[];
}
