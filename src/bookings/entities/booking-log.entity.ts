import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { BookingStatus } from './booking-status.entity';

@Entity('booking_logs')
export class BookingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.logs, { onDelete: 'SET NULL' })
  @JoinColumn({ referencedColumnName: 'uuid' })
  booking: Booking;

  @ManyToOne(() => BookingStatus, (booking) => booking.logs, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  bookingStatus: BookingStatus;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
