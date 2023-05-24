import {
  Brand,
  CarModel,
  CarType,
  EngineSize,
  FuelType,
  Option,
} from '../entities';

export interface ValidationInfo {
  carModel?: CarModel;
  fuelType?: FuelType;
  options?: Option[];
  brand?: Brand;
  engineSize?: EngineSize;
  carType?: CarType;
}
