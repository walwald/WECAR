import { Module } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { HostSigninLog } from './entities/host-signin.log.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Host, HostSigninLog])],
  exports: [TypeOrmModule],
  controllers: [HostsController],
  providers: [HostsService, AuthService],
})
export class HostsModule {}
