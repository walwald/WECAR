import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingStatus } from './booking-status.entity';

@Entity('booking_logs')
export class BookingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.logs)
  @JoinColumn({ referencedColumnName: 'uuid' })
  booking: Booking;

  @ManyToOne(() => BookingStatus, (booking) => booking.logs)
  @JoinColumn()
  bookingStatus: BookingStatus;
}
