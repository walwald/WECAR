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
import { Booking } from 'src/bookings/entities';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  //toss API에 맞게 수정
  //uuid를 FK로 쓰는 법 찾아보기

  @ManyToOne(() => Booking, (booking) => booking.payments)
  @JoinColumn({ referencedColumnName: 'uuid' })
  booking: Booking;

  //   @ManyToOne(() => HostCar, (hostCar) => hostCar.bookings, {
  //     onDelete: 'SET NULL',
  //   })
  //   @JoinColumn()
  //   hostCar: HostCar;

  //   @ManyToOne(() => User, (user) => user.bookings)
  //   @JoinColumn()
  //   user: User;

  //   @Column({ name: 'total_price', nullable: false })
  //   totalPrice: number;

  //   @Column()
  //   commission: number;

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
