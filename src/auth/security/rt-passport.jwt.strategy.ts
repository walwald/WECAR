import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Payload, ReqUser } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload): Promise<ReqUser> {
    const [, refreshToken] = req.get('authorization').split('Bearer ');

    return {
      ...payload,
      refreshToken,
    };
  }
}
