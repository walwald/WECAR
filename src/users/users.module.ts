import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSigninLog } from './entities/user-signin.log.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSigninLog])],
  exports: [TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
