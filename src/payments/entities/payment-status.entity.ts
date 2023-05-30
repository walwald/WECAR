import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentLog } from './payment-log.entity';
import { Payment } from './payment.entity';

@Entity('payment_statuses')
export class PaymentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => PaymentLog, (paymentLog) => paymentLog.paymentStatus)
  logs: PaymentLog[];

  @OneToMany(() => Payment, (payment) => payment.status)
  payments: Payment[];
}
