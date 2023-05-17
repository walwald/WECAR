import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SigninAuthDto } from './dto/signin.auth.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';
import { UsersService } from 'src/users/users.service';
import { Host } from 'src/hosts/entities/host.entity';
import { HostsService } from 'src/hosts/hosts.service';
import { UserSigninLog } from 'src/users/entities/user-signin.log.entity';
import { HostSigninLog } from 'src/hosts/entities/host-signin.log.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
    @InjectRepository(UserSigninLog)
    private userSigninLogRepository: Repository<UserSigninLog>,
    @InjectRepository(HostSigninLog)
    private hostSigninLogRepository: Repository<HostSigninLog>,
    private usersService: UsersService,
    private hostsService: HostsService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string, salt: string): Promise<string> {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 32, 'SHA512')
      .toString('base64');
  }

  createRefreshToken(id: number): string {
    const payload: Payload = { id };
    return this.jwtService.sign(payload, { expiresIn: '14d' });
  }

  //id랑 name만 받을 수 있게 entity 에서 implement/extends 할 수 있음
  //createTokens으로 함수 합치기

  createAccessToken(userOrHost: User | Host): string {
    const payload: Payload = {
      id: userOrHost.id,
      name: userOrHost.name,
    };

    return this.jwtService.sign(payload);
  }

  //entity에서 함수를 작성하고 그 함수 호출해서 password 체크 > 그 class를 상속받기
  //user나 host가 password(passwordcheck하는 메서드 포함) class를 상속받기
  async passwordCheck(signinData: SigninAuthDto, userOrHost: User | Host) {
    const hashedPassword = await this.hashPassword(
      signinData.password,
      userOrHost.passwordSalt,
    );

    if (userOrHost.password !== hashedPassword) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    return;
  }

  saveUserSigninLog(user: User, req: Request) {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    this.userSigninLogRepository.save({ user, ip, agent });
  }

  saveHostSigninLog(host: Host, req: Request) {
    const ip = req.get('host');
    const agent = req.get('User-Agent');
    this.hostSigninLogRepository.save({ host, ip, agent });
  }

  //User랑 Host 로그인 공통 로직 하나로 묶기
  async userSignin(signinData: SigninAuthDto, req: Request) {
    const user = await this.usersService.findOneByEmail(signinData.email);
    await this.passwordCheck(signinData, user);
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);
    await this.userRepository.update({ id: user.id }, { refreshToken });
    this.saveUserSigninLog(user, req);
    return { accessToken, refreshToken };
  }

  async hostSignin(signinData: SigninAuthDto, req) {
    const host = await this.hostsService.findOneByEmail(signinData.email);
    await this.passwordCheck(signinData, host);
    const accessToken = await this.createAccessToken(host);
    const refreshToken = await this.createRefreshToken(host.id);
    await this.hostRepository.update({ id: host.id }, { refreshToken });
    this.saveHostSigninLog(host, req);
    return { accessToken, refreshToken };
  }

  async tokenValidateUser(payload: Payload): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: payload.id });
  }

  async tokenValidateHost(payload: Payload): Promise<Host | null> {
    return await this.hostRepository.findOneBy({ id: payload.id });
  }

  async refreshUserAccessToken(reqUser) {
    const user = await this.userRepository.findOneBy({ id: reqUser.id });
    if (!user) throw new UnauthorizedException('User Not Found');

    if (user.refreshToken !== reqUser.refreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshToken = await this.createRefreshToken(user.id);
    await this.userRepository.update({ id: user.id }, { refreshToken });

    return {
      accessToken: await this.createAccessToken(user),
      refreshToken,
    };
  }

  async refreshHostAccessToken(reqUser) {
    const host = await this.hostRepository.findOneBy({ id: reqUser.id });
    if (!host) throw new UnauthorizedException('Host Not Found');

    if (host.refreshToken !== reqUser.refreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshToken = await this.createRefreshToken(host.id);
    await this.hostRepository.update({ id: host.id }, { refreshToken });

    return {
      accessToken: await this.createAccessToken(host),
      refreshToken,
    };
  }
}
