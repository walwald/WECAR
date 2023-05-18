import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './dto/token-related.interface';
import { UsersService } from 'src/users/users.service';
import { Host } from 'src/hosts/entities/host.entity';
import { HostsService } from 'src/hosts/hosts.service';
import { UserSigninLog } from 'src/users/entities/user-signin-log.entity';
import { HostSigninLog } from 'src/hosts/entities/host-signin.log.entity';
import { Request } from 'express';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
    private readonly utilsService: UtilsService,
  ) {}

  //조회만 하면 여기 있어도 괜찮을 듯
  async tokenValidateUser(payload: Payload): Promise<User | null> {
    return this.userRepository.findOneBy({ id: payload.id });
  }

  async tokenValidateHost(payload: Payload): Promise<Host | null> {
    return this.hostRepository.findOneBy({ id: payload.id });
  }

  //각각 나눠서 들어가야 할까
  async refreshUserAccessToken(reqUser) {
    const user = await this.userRepository.findOneBy({ id: reqUser.id });
    if (!user) throw new UnauthorizedException('User Not Found');

    if (user.refreshToken !== reqUser.refreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const tokens = this.utilsService.createTokens(user.id, user.name);
    await this.userRepository.update(
      { id: user.id },
      { refreshToken: tokens.refreshToken },
    );

    return { ...tokens };
  }

  async refreshHostAccessToken(reqUser) {
    const host = await this.hostRepository.findOneBy({ id: reqUser.id });
    if (!host) throw new UnauthorizedException('Host Not Found');

    if (host.refreshToken !== reqUser.refreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
    const tokens = this.utilsService.createTokens(host.id, host.name);
    await this.hostRepository.update(
      { id: host.id },
      { refreshToken: tokens.refreshToken },
    );

    return { ...tokens };
  }
}
