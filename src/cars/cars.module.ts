import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, CarModel, CarType, EngineSize } from './entities';
import { HostCar } from './entities/host-car.entity';
import { FuelType } from './entities/fuel-type.entity';
import { FileUrl } from 'src/utils/entities/file-url.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HostsModule } from 'src/hosts/hosts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarModel,
      Brand,
      EngineSize,
      CarType,
      HostCar,
      FuelType,
      FileUrl,
    ]),
    AuthModule,
    HostsModule,
  ],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
