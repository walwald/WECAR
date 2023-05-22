import { Controller, Get, UseGuards } from '@nestjs/common';
import AuthService from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorators/user.decorator';
import { Payload, ReqUser } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check/user')
  @UseGuards(AuthGuard('jwt-user'))
  isAuthenticatedUser(@User() user: ReqUser): Payload {
    return { id: user.id, name: user.name };
  }

  @Get('check/host')
  @UseGuards(AuthGuard('jwt-host'))
  isAuthenticatedHost(@User() user: ReqUser): Payload {
    return { id: user.id, name: user.name };
  }
}
