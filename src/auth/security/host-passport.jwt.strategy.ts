import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import AuthService from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from '../dto';
import { Host } from 'src/hosts/entities/host.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HostAtStrategy extends PassportStrategy(Strategy, 'jwt-host') {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY'),
      ignoreExpoiration: true,
    });
  }
  async validate(payload: Payload): Promise<Host> {
    const host = await this.authService.tokenValidateHost(payload);
    if (!host) throw new UnauthorizedException('Host Not Found');

    return host;
  }
}
