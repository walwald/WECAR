import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity('engine_sizes')
export class EngineSize {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => CarModel, (carModel) => carModel.brand)
  carModels: CarModel[];
}
