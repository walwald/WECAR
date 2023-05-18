import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import AuthService from './auth.service';
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
import { UserSigninLog } from 'src/users/entities/user-signin-log.entity';
import { HostSigninLog } from 'src/hosts/entities/host-signin.log.entity';
import { UsersModule } from 'src/users/users.module';
import { HostsModule } from 'src/hosts/hosts.module';
import { UtilsModule } from 'src/utils/utils.module';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User, Host, UserSigninLog, HostSigninLog]),
    PassportModule,
    UtilsModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserAtStrategy, HostAtStrategy, RtStrategy],
})

//module import하고 그 안에서 service export
//다른 객체의 내용물을 사용하고 싶을 때는 그 객체에서 service 등을 export하고, 사용하는 곳에서 module 전체를 import 해야함
//서로 참조할 때는 forwardRef를 한 쪽에만 걸어줘야 함 (둘 다 걸거나, 둘 다 안 걸면 circular dependencies 에러 발생)
export class AuthModule {}
