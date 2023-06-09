import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Host } from './host.entity';

@Entity('host_signin_history')
export class HostSigninLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Host, (host) => host.signinLogs, { onDelete: 'SET NULL' })
  @JoinColumn()
  host: Host;

  @Column()
  ip: string;

  @Column()
  agent: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
