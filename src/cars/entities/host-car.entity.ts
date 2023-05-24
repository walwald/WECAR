import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarModel } from './car-model.entity';
import { Host } from 'src/hosts/entities/host.entity';
import { FuelType } from './fuel-type.entity';
import { File } from 'src/utils/entities/file.entity';

@Entity('host_cars')
export class HostCar {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Host, { onDelete: 'SET NULL' })
  @JoinColumn()
  host: Host;

  @Column({ name: 'car_number', unique: true, nullable: false })
  carNumber: string;

  @ManyToOne(() => CarModel, (carModel) => carModel.hostCars, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  carModel: CarModel;

  @ManyToOne(() => FuelType, (fuelType) => fuelType.hostCars, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  fuelType: FuelType;

  @Column()
  address: string;

  @Column({ name: 'price_per_day', nullable: false })
  pricePerDay: number;

  @Column('simple-array')
  options: string[];

  @OneToMany(() => File, (File) => File.hostCar)
  files: File[];

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
