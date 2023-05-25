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
//password class를 extend 해서 메서드 상속받기
//로그인 history 저장 > 바로 save 가능할 듯?
