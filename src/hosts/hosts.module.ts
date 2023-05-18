import { Module } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';
import { HostSigninLog } from './entities/host-signin.log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Host, HostSigninLog]),
    UsersModule,
    UtilsModule,
  ],
  exports: [TypeOrmModule, HostsService],
  controllers: [HostsController],
  providers: [HostsService],
})
export class HostsModule {}
