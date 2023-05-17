import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/signup.user.dto';
import { SigninAuthDto } from 'src/auth/dto/signin.auth.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('signup')
  create(@Body() userData: SignupUserDto) {
    return this.usersService.create(userData);
  }

  @Post('signin')
  userSignin(@Body() signinData: SigninAuthDto, @Req() req: Request) {
    return this.usersService.userSignin(signinData, req);
  }
}
