import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSigninLog } from './user-signin-log.entity';
import { BaseUser } from './base-user.entity';
import { Booking } from 'src/bookings/entities';

@Entity('users')
export class User extends BaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'drviers_license_number', unique: true, nullable: false })
  driversLicenseNumber: string;

  @Column({ nullable: false })
  birthday: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => UserSigninLog, (signinLog) => signinLog.user)
  signinLogs: UserSigninLog[];
}
