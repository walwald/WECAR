import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthService from '../auth.service';
import { Payload } from '../dto';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserAtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(
    private authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY'),
      ignoreExpoiration: true,
    });
  }

  async validate(payload: Payload): Promise<User> {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) throw new UnauthorizedException('User Not Found');

    return user;
  }
}
