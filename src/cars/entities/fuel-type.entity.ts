import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HostCar } from './host-car.entity';

@Entity('fuel_types')
export class FuelType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fuel_type', unique: true, nullable: false })
  type: string;

  @OneToMany(() => HostCar, (hostCar) => hostCar.fuelType)
  hostCars: HostCar[];
}
