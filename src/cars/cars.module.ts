import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, CarModel, CarType, EngineSize } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CarModel, Brand, EngineSize, CarType])],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
