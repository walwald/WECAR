import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';
import { UtilsController } from './utils.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('SECRET_KEY'),
        signOptions: { expiresIn: '3m' },
      }),
    }),
  ],
  exports: [UtilsService],
  controllers: [UtilsController],
  providers: [UtilsService, AwsService],
})
export class UtilsModule {}
