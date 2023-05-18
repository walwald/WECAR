import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import AuthService from './auth.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from 'src/utils/decorators/user.decorator';
import { ReqUser } from './dto/token-related.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check/user')
  @UseGuards(AuthGuard('jwt-user'))
  isAuthenticatedUser(@User() user: ReqUser): ReqUser {
    return user;
  }

  @Get('check/host')
  @UseGuards(AuthGuard('jwt-host'))
  isAuthenticatedHost(@User() user: ReqUser): ReqUser {
    return user;
  }

  @Get('refresh/user')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshUserAccessToken(@User() user: ReqUser) {
    return this.authService.refreshUserAccessToken(user);
  }

  @Get('refresh/host')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshHostAccessToken(@User() user: ReqUser) {
    return this.authService.refreshHostAccessToken(user);
  }
}

//custom decorator = req.user 만들어두면 편함 - nest 공식 문서
