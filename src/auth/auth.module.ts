import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import {
  HostAtStrategy,
  UserAtStrategy,
} from './security/passport.jwt.strategy';
import { Host } from 'src/hosts/entities/host.entity';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User, Host]),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserAtStrategy, HostAtStrategy],
})
export class AuthModule {}
