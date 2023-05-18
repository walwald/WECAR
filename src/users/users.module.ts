import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { UserSigninLog } from './entities/user-signin-log.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSigninLog]),
    UtilsModule,
    AuthModule,
  ],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

//typeorommodule export 확인
