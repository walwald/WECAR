import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentStatus } from './payment-status.entity';

@Entity('payment_logs')
export class PaymentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Payment, (payment) => payment.logs, { onDelete: 'SET NULL' })
  @JoinColumn()
  payment: Payment;

  @ManyToOne(() => PaymentStatus, (payment) => payment.logs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  paymentStatus: PaymentStatus;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
