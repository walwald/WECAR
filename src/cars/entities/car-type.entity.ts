import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity('car_types')
export class CarType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'car_type', unique: true, nullable: false })
  type: string;

  @OneToMany(() => CarModel, (carModel) => carModel.brand)
  carModels: CarModel[];
}
