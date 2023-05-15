import { Module } from '@nestjs/common';
import { SellersController } from './hosts.controller';
import { SellersService } from './hosts.service';

@Module({
  controllers: [SellersController],
  providers: [SellersService],
})
export class SellersModule {}
