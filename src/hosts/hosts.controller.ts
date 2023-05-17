import { Body, Controller, Post, Req } from '@nestjs/common';
import { HostsService } from './hosts.service';
import { SignupHostDto } from './dto/signup.host.dto';
import { SigninAuthDto } from 'src/auth/dto/signin.auth.dto';
import { Request } from 'express';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}
  @Post('signup')
  create(@Body() hostData: SignupHostDto) {
    return this.hostsService.create(hostData);
  }

  @Post('signin')
  hostSignin(@Body() signinData: SigninAuthDto, @Req() req: Request) {
    return this.hostsService.hostSignin(signinData, req);
  }
}
