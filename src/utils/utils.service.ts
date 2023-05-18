import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Payload, Tokens } from 'src/auth/dto/token-related.interface';

export class UtilsService {
  constructor(private readonly jwtService: JwtService) {}

  //utils로 옮기기
  static hashPassword(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'SHA512')
      .toString('base64');
  }

  static createSalt(): string {
    return crypto.randomBytes(64).toString('base64');
  }

  //id랑 name만 받을 수 있게 entity 에서 implement/extends 할 수 있음
  //createTokens으로 함수 합치기 > 합치고 entity에 넣기? update까지 한 번에?

  createTokens(id: number, name: string): Tokens {
    const payload: Payload = { id, name };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });
    const accessToken = this.jwtService.sign(payload);
    return { refreshToken, accessToken };
  }
}
