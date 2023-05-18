import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { HostsService } from './hosts.service';
import { SignupHostDto } from './dto/signup.host.dto';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { Request } from 'express';
import { ReqUser, Tokens } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorators/user.decorator';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}
  @Post('signup')
  signup(@Body() hostData: SignupHostDto): Promise<Tokens> {
    return this.hostsService.signup(hostData);
  }

  @Post('signin')
  signin(
    @Body() singinData: SigninAuthDto,
    @Req() req: Request,
  ): Promise<Tokens> {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    return this.hostsService.signin(singinData, ip, agent);
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshHostAccessToken(@User() user: ReqUser): Promise<Tokens> {
    return this.hostsService.refreshAccessToken(user);
  }
}
