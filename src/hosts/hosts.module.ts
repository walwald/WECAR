import { Module } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';

@Module({
  controllers: [HostsController],
  providers: [HostsService],
})
export class HostsModule {}
