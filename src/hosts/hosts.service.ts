import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Host } from './entities/host.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupHostDto } from './dto/signup.host.dto';
import * as crypto from 'crypto';

@Injectable()
export class HostsService {
  constructor(
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
  ) {}

  async findOneByEmail(email: string): Promise<Host | null> {
    const host = await this.hostRepository.findOneBy({ email });
    if (!host) {
      throw new NotFoundException(`Host with Email ${email} not found`);
    }
    return host;
  }

  async create(hostData: SignupHostDto): Promise<void> {
    const { email, phoneNumber, password } = hostData;
    const duplicateEmail = await this.hostRepository.findOneBy({ email });
    const duplicatePhone = await this.hostRepository.findOneBy({ phoneNumber });

    if (duplicateEmail || duplicatePhone)
      throw new UnauthorizedException('Duplicate Host');

    const salt = await crypto.randomBytes(64).toString('base64');
    hostData.passwordSalt = salt;
    hostData.password = await crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'SHA512')
      .toString('base64');

    await this.hostRepository.save(hostData);
  }
}
