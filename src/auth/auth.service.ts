import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SigninAuthDto } from './dto/signin.auth.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  createRefreshToken(userId: number): string {
    const payload: Payload = { userId };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });
    this.userRepository.update({ id: userId }, { refreshToken });
    return refreshToken;
  }

  async signin(signinData: SigninAuthDto) {
    const user = await this.userRepository.findOneBy({
      email: signinData.email,
    });

    if (!user) throw new NotFoundException('Invalid User');

    const hashedPassword = await crypto
      .pbkdf2Sync(signinData.password, user.passwordSalt, 1000, 32, 'SHA512')
      .toString('base64');

    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const payload: Payload = {
      userId: user.id,
      userName: user.name,
    };

    return {
      accessToken: await this.jwtService.sign(payload),
      refreshToken: await this.createRefreshToken(user.id),
    };
  }
}
