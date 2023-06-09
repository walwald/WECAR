import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupUserDto } from './dto/signup.user.dto';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { Request } from 'express';
import { ReqUser, Tokens } from 'src/auth/types';
import { User } from 'src/utils/decorators/user.decorator';
import { RtAuthGuard } from 'src/auth/security/rt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('signup')
  signup(@Body() userData: SignupUserDto): Promise<Tokens> {
    return this.usersService.signup(userData);
  }

  @Post('signin')
  signin(
    @Body() signinData: SigninAuthDto,
    @Req() req: Request,
  ): Promise<Tokens> {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    return this.usersService.signin(signinData, ip, agent);
  }

  @Get('refresh')
  @UseGuards(RtAuthGuard)
  refreshUserAccessToken(@User() user: ReqUser): Promise<Tokens> {
    return this.usersService.refreshAccessToken(user);
  }
}
