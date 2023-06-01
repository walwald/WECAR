import { Inject, Module, forwardRef } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';
import { UtilsController } from './utils.controller';
import { SchedulerService } from './scheduler.service';
import { HostCar } from 'src/cars/entities';
import { Booking, BookingStatus } from 'src/bookings/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('SECRET_KEY'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
    TypeOrmModule.forFeature([HostCar, Booking]),
    forwardRef(() => BookingsModule),
  ],
  exports: [UtilsService],
  controllers: [UtilsController],
  providers: [UtilsService, AwsService, SchedulerService],
})
export class UtilsModule {}
