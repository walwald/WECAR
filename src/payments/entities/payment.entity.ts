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
import { PaymentStatus } from './payment-status.entity';
import { PaymentLog } from './payment-log.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, nullable: false })
  uuid: string;

  //   @ManyToOne(() => HostCar, (hostCar) => hostCar.bookings, {
  //     onDelete: 'SET NULL',
  //   })
  //   @JoinColumn()
  //   hostCar: HostCar;

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

  @ManyToOne(() => PaymentStatus, (paymentStatus) => paymentStatus.payments)
  @JoinColumn()
  status: PaymentStatus;

  @OneToMany(() => PaymentLog, (paymentLog) => paymentLog.payment)
  logs: PaymentLog[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
