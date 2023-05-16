import { Module } from '@nestjs/common';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Host } from './entities/host.entity';
import { Type } from 'class-transformer';

@Module({
  imports: [TypeOrmModule.forFeature([Host])],
  exports: [TypeOrmModule],
  controllers: [HostsController],
  providers: [HostsService],
})
export class HostsModule {}
