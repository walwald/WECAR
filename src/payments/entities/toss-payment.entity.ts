import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from 'src/payments/entities';
import { TossCard } from './toss-card.entity';

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

  @OneToOne(() => TossCard, (tossCard) => tossCard.tossInfo)
  @JoinColumn()
  card: TossCard;

  @ManyToOne(() => Payment, (payment) => payment.tossInfo, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  payment: Payment;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
