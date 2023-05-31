import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from 'src/payments/entities';

@Entity('Toss_Info')
export class TossInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  currency: string;

  @Column({ name: 'total_amount' })
  totalAmount: number;

  @Column()
  vat: number;

  @ManyToOne(() => Payment, (payment) => payment.tossInfo, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  payment: Payment;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
