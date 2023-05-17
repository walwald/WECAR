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
import { HostSigninLog } from './entities/host-signin.log.entity';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { SigninAuthDto } from 'src/auth/dto/signin.auth.dto';
import { Payload } from 'src/auth/security/payload.interface';

@Injectable()
export class HostsService {
  constructor(
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
    @InjectRepository(HostSigninLog)
    private hostSigninLogRepository: Repository<HostSigninLog>,
    private authService: AuthService,
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
    return;
  }

  async hostSignin(signinData: SigninAuthDto, req: Request) {
    const host = await this.findOneByEmail(signinData.email);
    const accessToken = await this.authService.createAccessToken(
      signinData,
      host,
    );
    const refreshToken = await this.authService.createRefreshToken(host.id);
    await this.hostRepository.update({ id: host.id }, { refreshToken });
    this.saveHostSigninLog(host, req);
    return { accessToken, refreshToken };
  }

  saveHostSigninLog(host: Host, req: Request) {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    this.hostSigninLogRepository.save({ host, ip, agent });
    return;
  }

  async tokenValidateHost(payload: Payload): Promise<Host | null> {
    return await this.hostRepository.findOneBy({ id: payload.id });
  }
}
