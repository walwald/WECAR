import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import AuthService from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Host } from 'src/hosts/entities/host.entity';
import { UserSigninLog } from 'src/users/entities/user-signin-log.entity';
import { HostSigninLog } from 'src/hosts/entities/host-signin.log.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { HostAtStrategy, RtStrategy, UserAtStrategy } from './security';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('SECRET_KEY'),
        signOptions: { expiresIn: '3m' },
      }),
    }),
    TypeOrmModule.forFeature([User, Host, UserSigninLog, HostSigninLog]),
    PassportModule,
    UtilsModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UserAtStrategy, HostAtStrategy, RtStrategy],
})
export class AuthModule {}
