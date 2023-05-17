import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin.auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin/user')
  userSignin(@Body() signinData: SigninAuthDto, @Req() req: Request) {
    return this.authService.userSignin(signinData, req);
  }
  //req에서 ip, agent 뽑아서 넘기기

  @Post('signin/host')
  hostSignin(@Body() signinData: SigninAuthDto, @Req() req: Request) {
    return this.authService.hostSignin(signinData, req);
  }

  @Get('check/user')
  @UseGuards(AuthGuard('jwt-user'))
  isAuthenticatedUser(@Req() req: Request): any {
    return req.user;
  }

  @Get('check/host')
  @UseGuards(AuthGuard('jwt-host'))
  isAuthenticatedHost(@Req() req: Request): any {
    return req.user;
  }

  @Get('refresh/user')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshUserAccessToken(@Req() req: Request) {
    return this.authService.refreshUserAccessToken(req.user);
  }

  @Get('refresh/host')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshHostAccessToken(@Req() req: Request) {
    return this.authService.refreshHostAccessToken(req.user);
  }
}
