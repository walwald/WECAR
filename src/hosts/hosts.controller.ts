import { Body, Controller, Post, Req } from '@nestjs/common';
import { HostsService } from './hosts.service';
import { SignupHostDto } from './dto/signup.host.dto';
import { Tokens } from 'src/auth/dto/token-related.interface';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { Request } from 'express';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}
  @Post('signup')
  signup(@Body() hostData: SignupHostDto): Promise<Tokens> {
    return this.hostsService.signup(hostData);
  }

  @Post('signin')
  signin(@Body() singinData: SigninAuthDto, @Req() req: Request) {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    return this.hostsService.signin(singinData, ip, agent);
  }
}
