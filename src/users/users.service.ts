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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    //salt를 따로 넣기

    await this.userRepository.save(userData);
  }
}
