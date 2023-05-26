import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HostCar } from './host-car.entity';

@Entity('host_car_statuses')
export class HostCarStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => HostCar, (hostCar) => hostCar.status)
  hostCars: HostCar[];
}
