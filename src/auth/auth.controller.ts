import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  // @Get('refresh')
  // @UseGuards(AuthGuard('jwt-refresh'))
  // refreshAccessToken(@Req() req: Request, @Res() res: Response) {
  //   this.authService.refreshAccessToken(req.user);

  //   res.redirect('/');
  // }
}
