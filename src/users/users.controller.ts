import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/signup.user.dto';
import { Tokens } from 'src/auth/dto/token-related.interface';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('signup')
  signup(@Body() userData: SignupUserDto): Promise<Tokens> {
    return this.usersService.signup(userData);
  }

  @Post('signin')
  signin(@Body() signinData: SigninAuthDto, @Req() req: Request) {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    return this.usersService.signin(signinData, ip, agent);
  }
  //req에서 ip, agent 뽑아서 넘기기
}
