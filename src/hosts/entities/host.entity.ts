import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HostSigninLog } from './host-signin.log.entity';
import { BaseUser } from 'src/users/entities/base-user.entity';

@Entity('hosts')
export class Host extends BaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => HostSigninLog, (signinLog) => signinLog.host)
  signinLogs: HostSigninLog[];
}
