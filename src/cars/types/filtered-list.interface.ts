import { HostCar } from '../entities';

export interface FilteredList {
  totalCount: number;
  hostCars: HostCar[];
}
