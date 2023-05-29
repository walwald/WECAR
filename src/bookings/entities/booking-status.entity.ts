import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingLog } from './booking-log.entity';

@Entity('booking_statuses')
export class BookingStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => BookingLog, (bookingLog) => bookingLog.bookingStatus)
  logs: BookingLog[];

  @OneToMany(() => Booking, (booking) => booking.status)
  bookings: Booking[];
}
