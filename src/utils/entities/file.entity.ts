import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HostCar } from 'src/cars/entities';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false, length: 1000 })
  url: string;

  @Column({ unique: true, nullable: false })
  type: string;

  @ManyToOne(() => HostCar, (hostCar) => hostCar.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hostCar: HostCar;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
