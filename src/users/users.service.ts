import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDto } from './dto/signup.user.dto';
import * as crypto from 'crypto';
import { SigninAuthDto } from 'src/auth/dto/signin.auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserSigninLog } from './entities/user-signin.log.entity';
import { Request } from 'express';
import { Payload } from 'src/auth/security/payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSigninLog)
    private userSigninLogRepository: Repository<UserSigninLog>,
    private authService: AuthService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }
    return user;
  }

  async create(userData: SignupUserDto): Promise<void> {
    const { email, phoneNumber, driversLicenseNumber, password } = userData;
    const duplicateEmail = await this.userRepository.findOneBy({ email });
    const duplicatePhone = await this.userRepository.findOneBy({ phoneNumber });
    const duplicateLicense = await this.userRepository.findOneBy({
      driversLicenseNumber,
    });
    if (duplicateEmail || duplicatePhone || duplicateLicense)
      throw new UnauthorizedException('Duplicate User');

    const salt = await crypto.randomBytes(64).toString('base64');
    userData.passwordSalt = salt;
    userData.password = await crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'SHA512')
      .toString('base64');

    await this.userRepository.save(userData);
    return;
  }

  async userSignin(signinData: SigninAuthDto, req: Request) {
    const user = await this.findOneByEmail(signinData.email);
    const accessToken = await this.authService.createAccessToken(
      signinData,
      user,
    );
    const refreshToken = await this.authService.createRefreshToken(user.id);
    await this.userRepository.update({ id: user.id }, { refreshToken });
    this.saveUserSigninLog(user, req);
    return { accessToken, refreshToken };
  }

  saveUserSigninLog(user: User, req: Request) {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    this.userSigninLogRepository.save({ user, ip, agent });
    return;
  }

  async tokenValidateUser(payload: Payload): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: payload.id });
  }
}
