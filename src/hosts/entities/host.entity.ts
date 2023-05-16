import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hosts')
export class Host {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
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

  @Column({ name: 'marketing_agreement' })
  marketingAgreement: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
