import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HostSigninLog } from './host-signin.log.entity';
import { BaseUser } from 'src/users/entities/base-user.entity';
import { HostCar } from 'src/cars/entities/host-car.entity';

@Entity('hosts')
export class Host extends BaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => HostSigninLog, (signinLog) => signinLog.host)
  signinLogs: HostSigninLog[];

  @OneToOne(() => HostCar, (hostCar) => hostCar.host)
  car: HostCar;
}
