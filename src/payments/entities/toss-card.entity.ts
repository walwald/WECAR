import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TossInfo } from './toss-payment.entity';

@Entity('toss_cards')
export class TossCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column({ name: 'card_type' })
  cardType: string;

  @Column({ name: 'owner_type' })
  ownerType: string;

  @Column()
  amount: number;

  @OneToOne(() => TossInfo, (tossInfo) => tossInfo.card)
  tossInfo: TossInfo;
}
