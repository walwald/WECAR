import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { HostsModule } from './hosts/hosts.module';
import { BookingsModule } from './bookings/bookings.module';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Host } from './hosts/entities/host.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UserSigninLog } from './users/entities/user-signin.log.entity';
import { HostSigninLog } from './hosts/entities/host-signin.log.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Host, UserSigninLog, HostSigninLog],
      synchronize: true,
      autoLoadEntities: true,
      charset: 'utf8mb4',
      logging: true,
      keepConnectionAlive: true,
    }),
    UsersModule,
    CarsModule,
    HostsModule,
    BookingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private datasource: DataSource) {}
}
