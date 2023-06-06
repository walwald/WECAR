import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Payload, Tokens } from 'src/auth/types';
import { PageEnum } from './common.enum';

@Injectable()
export class UtilsService {
  constructor(
    public readonly jwtService: JwtService,
    readonly config: ConfigService,
  ) {}

  static hashPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'SHA512')
      .toString('base64');
  }

  static createSalt(): string {
    return crypto.randomBytes(64).toString('base64');
  }

  createTokens(id: number, name: string): Tokens {
    const payload: Payload = { id, name };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    return { refreshToken, accessToken };
  }

  makeKrDate(date: Date): Date {
    const correctedDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return correctedDate;
  }

  pagenation(query, page: number) {
    const skip = page ? (page - 1) * PageEnum.LIMIT : 0;

    return query.take(PageEnum.LIMIT).skip(skip);
  }
}
