import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { EngineSize } from './enginesize.entity';
import { CarType } from './car-type.entity';
import { HostCar } from './host-car.entity';

@Entity('car_models')
export class CarModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Brand, (brand) => brand.carModels, { onDelete: 'SET NULL' })
  @JoinColumn()
  brand: Brand;

  @ManyToOne(() => EngineSize, (engineSize) => engineSize.carModels, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  engineSize: EngineSize;

  @ManyToOne(() => CarType, (carType) => carType.carModels, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  carType: CarType;

  @OneToMany(() => HostCar, (hostCar) => hostCar.carModel)
  hostCars: HostCar[];

  @Column()
  capacity: number;
}
