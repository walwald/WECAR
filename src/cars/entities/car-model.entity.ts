import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { EngineSize } from './enginesize.entity';
import { CarType } from './car-type.entity';

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

  @Column()
  capacity: number;
}
