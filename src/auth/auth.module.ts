import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import {
  HostAtStrategy,
  RtStrategy,
  UserAtStrategy,
} from './security/passport.jwt.strategy';
import { HostsService } from 'src/hosts/hosts.service';
import { Host } from 'src/hosts/entities/host.entity';
import { UserSigninLog } from 'src/users/entities/user-signin.log.entity';
import { HostSigninLog } from 'src/hosts/entities/host-signin.log.entity';
import { UsersModule } from 'src/users/users.module';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User, Host, UserSigninLog, HostSigninLog]),
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    HostsService,
    UserAtStrategy,
    HostAtStrategy,
    RtStrategy,
  ],
})
//module import하고 그 안에서 service export
export class AuthModule {}
