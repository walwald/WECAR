import { Module, forwardRef } from '@nestjs/common';
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
import { UsersModule } from 'src/users/users.module';
import { HostsModule } from 'src/hosts/hosts.module';
import { UsersService } from 'src/users/users.service';
import { HostsService } from 'src/hosts/hosts.service';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
    TypeOrmModule.forFeature([User, Host]),
    PassportModule,
    forwardRef(() => UsersModule),
    forwardRef(() => HostsModule),
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserAtStrategy,
    HostAtStrategy,
    UsersService,
    HostsService,
  ],
})
export class AuthModule {}
