import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import AuthService from '../auth.service';
import { Request } from 'express';
import { Payload } from '../dto';

//파일 분리 user, host
//다 분리하고 index 만들기

@Injectable()
export class UserAtStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpoiration: true,
    });
  }

  //user를 매번 확인해야 할 지/ payload에 id 있으니까
  async validate(payload: Payload): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) throw new UnauthorizedException('User Not Found');

    return user;
  }
}

@Injectable()
export class HostAtStrategy extends PassportStrategy(Strategy, 'jwt-host') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpoiration: true,
    });
  }
  async validate(payload: Payload): Promise<any> {
    const host = await this.authService.tokenValidateHost(payload);
    if (!host) throw new UnauthorizedException('Host Not Found');

    return host;
  }
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
      passReqToCallback: true,
    });
  }

  //구조분해 할당
  async validate(req: Request, payload: Payload) {
    const [, refreshToken] = req.get('authorization').split('Bearer ');

    return {
      ...payload,
      refreshToken,
    };
  }
}
