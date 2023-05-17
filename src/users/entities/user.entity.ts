import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSigninLog } from './user-signin.log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'password_salt' })
  passwordSalt: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'phone_number', unique: true, nullable: false })
  phoneNumber: string;

  @Column({ name: 'drviers_license_number', unique: true, nullable: false })
  driversLicenseNumber: string;

  @Column({ nullable: false })
  birthday: Date;

  @Column({ name: 'marketing_agreement' })
  marketingAgreement: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserSigninLog, (signinLog) => signinLog.user)
  signinLogs: UserSigninLog[];
}
