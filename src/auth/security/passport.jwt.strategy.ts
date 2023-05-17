import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from './payload.interface';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { HostsService } from 'src/hosts/hosts.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UserAtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpoiration: true,
    });
  }
  async validate(payload: Payload): Promise<any> {
    const user = await this.usersService.tokenValidateUser(payload);
    if (!user) throw new UnauthorizedException('User Not Found');

    return user;
  }
}

@Injectable()
export class HostAtStrategy extends PassportStrategy(Strategy, 'jwt-host') {
  constructor(private hostsService: HostsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpoiration: true,
    });
  }
  async validate(payload: Payload): Promise<any> {
    const host = await this.hostsService.tokenValidateHost(payload);
    if (!host) throw new UnauthorizedException('Host Not Found');

    return host;
  }
}

// @Injectable()
// export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.SECRET_KEY,
//       passReqToCallback: true,
//     });
//   }

//   async validate(req: Request, payload: Payload) {
//     const refreshToken = req.get('authorization').split('Bearer ')[1];

//     return {
//       ...payload,
//       refreshToken,
//     };
//   }
// }
