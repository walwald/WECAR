import { Body, Controller, Post } from '@nestjs/common';
import { HostsService } from './hosts.service';
import { SignupHostDto } from './dto/signup.host.dto';

@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}
  @Post('signup')
  create(@Body() hostData: SignupHostDto) {
    return this.hostsService.create(hostData);
  }
}
