import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ name: 'logo_url', unique: true })
  logoUrl: string;

  @OneToMany(() => CarModel, (carModel) => carModel.brand)
  carModels: CarModel[];
}
