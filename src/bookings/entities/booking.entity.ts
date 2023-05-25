import { HostCar } from 'src/cars/entities';
import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from './booking-status.entity';
import { BookingLog } from './booking-log.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  uuid: string;

  @ManyToOne(() => HostCar, (hostCar) => hostCar.bookings, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  hostCar: HostCar;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn()
  user: User;

  @Column({ name: 'start_date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', nullable: false })
  endDate: Date;

  @Column({ name: 'total_price', nullable: false })
  totalPrice: number;

  @Column()
  commission: number;

  @ManyToOne(() => BookingStatus, (bookingStatus) => bookingStatus.bookings)
  @JoinColumn()
  status: BookingStatus;

  @OneToMany(() => BookingLog, (bookingLog) => bookingLog.booking)
  logs: BookingLog[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
