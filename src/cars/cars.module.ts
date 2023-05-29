import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, CarModel, CarType, EngineSize, Option } from './entities';
import { HostCar } from './entities/host-car.entity';
import { FuelType } from './entities/fuel-type.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HostsModule } from 'src/hosts/hosts.module';
import { File } from 'src/utils/entities/file.entity';
import { Booking } from 'src/bookings/entities';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarModel,
      Brand,
      EngineSize,
      CarType,
      HostCar,
      FuelType,
      File,
      Option,
      Booking,
    ]),
    AuthModule,
    HostsModule,
    ScheduleModule.forRoot(),
  ],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
