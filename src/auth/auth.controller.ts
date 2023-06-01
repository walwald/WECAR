import { Controller, Get, UseGuards } from '@nestjs/common';
import AuthService from './auth.service';
import { User } from 'src/utils/decorators/user.decorator';
import { Payload, ReqUser } from './types';
import { UserAuthGuard } from './security';
import { HostAuthGuard } from './security/host-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check/user')
  @UseGuards(UserAuthGuard)
  isAuthenticatedUser(@User() user: ReqUser): Payload {
    return { id: user.id, name: user.name };
  }

  @Get('check/host')
  @UseGuards(HostAuthGuard)
  isAuthenticatedHost(@User() user: ReqUser): Payload {
    return { id: user.id, name: user.name };
  }
}
