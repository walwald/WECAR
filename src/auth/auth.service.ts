import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SigninAuthDto } from './dto/signin.auth.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';
import { Host } from 'src/hosts/entities/host.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string, salt: string): Promise<string> {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'SHA512')
      .toString('base64');
  }

  async createRefreshToken(id: number): Promise<string> {
    const payload: Payload = { id };
    return this.jwtService.sign(payload, { expiresIn: '14d' });
  }

  async createAccessToken(
    signinData: SigninAuthDto,
    userOrHost: User | Host,
  ): Promise<string> {
    const hashedPassword = await this.hashPassword(
      signinData.password,
      userOrHost.passwordSalt,
    );

    if (userOrHost.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const payload: Payload = {
      id: userOrHost.id,
      name: userOrHost.name,
    };

    return this.jwtService.sign(payload);
  }

  // async refreshAccessToken(reqUser: User) {
  //   const user = await this.userRepository.findOneBy({ id: reqUser.id });

  //   if (!user) throw new UnauthorizedException('User Not Found');

  //   if (user.refreshToken !== reqUser.refreshToken) {
  //     throw new UnauthorizedException('Invalid Token');
  //   }

  //   const payload: Payload = {
  //     id: user.id,
  //     name: user.name,
  //   };

  //   const refreshToken = await this.createRefreshToken(user.id);
  //   this.userRepository.update({ id: user.id }, { refreshToken });
  //   return {
  //     accessToken: await this.jwtService.sign(payload),
  //     refreshToken,
  //   };
  // }
}
