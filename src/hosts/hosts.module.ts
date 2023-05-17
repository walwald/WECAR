import { Module, forwardRef } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { HostSigninLog } from './entities/host-signin.log.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Host, HostSigninLog]),
    forwardRef(() => AuthModule),
    forwardRef(() => JwtModule),
  ],
  exports: [TypeOrmModule],
  controllers: [HostsController],
  providers: [HostsService, AuthService],
})
export class HostsModule {}
