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
import { PaymentStatus } from './payment-status.entity';
import { PaymentLog } from './payment-log.entity';
import { Booking } from 'src/bookings/entities';
import { TossInfo } from './toss-payment.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ referencedColumnName: 'uuid' })
  booking: Booking;

  @Column()
  method: string;

  @OneToMany(() => TossInfo, (tossInfo) => tossInfo.payment)
  tossInfo: TossInfo[];

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
