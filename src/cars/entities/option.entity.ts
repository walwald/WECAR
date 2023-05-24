import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HostCar } from './host-car.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => HostCar)
  hostCars: HostCar[];
}
