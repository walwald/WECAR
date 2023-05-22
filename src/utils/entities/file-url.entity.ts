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

@Entity('file_urls')
export class FileUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  url: string;

  @ManyToOne(() => HostCar, (hostCar) => hostCar.fileUrls)
  @JoinColumn()
  hostCar: HostCar;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
