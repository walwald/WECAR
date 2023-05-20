import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Host } from './entities/host.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupHostDto } from './dto/signup.host.dto';
import { UtilsService } from 'src/utils/utils.service';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { HostSigninLog } from './entities/host-signin.log.entity';
import { ReqUser, Tokens } from 'src/auth/dto';

@Injectable()
export class HostsService {
  constructor(
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
    @InjectRepository(HostSigninLog)
    private hostSigninLogRepository: Repository<HostSigninLog>,
    private readonly utilsService: UtilsService,
  ) {}

  async findOneByEmail(email: string): Promise<Host | null> {
    const host = await this.hostRepository.findOneBy({ email });
    if (!host) {
      throw new NotFoundException(`Host with Email ${email} not found`);
    }
    return host;
  }

  async signup(hostData: SignupHostDto): Promise<Tokens> {
    const { phoneNumber, email } = hostData;

    const duplicateHost: Host = await this.hostRepository.findOne({
      where: [{ phoneNumber }, { email }],
    });

    if (duplicateHost)
      throw new UnauthorizedException(`Duplicate Email or Phone Number`);

    const newHost = this.hostRepository.create(hostData);
    newHost.updatePassword(newHost.password);

    const tokens = this.utilsService.createTokens(newHost.id, newHost.name);
    newHost.refreshToken = tokens.refreshToken;

    await this.hostRepository.save(newHost);

    return { ...tokens };
  }

  async signin(
    signinData: SigninAuthDto,
    ip: string,
    agent: string,
  ): Promise<Tokens> {
    const host = await this.findOneByEmail(signinData.email);

    await host.checkPassword(signinData.password);

    this.hostSigninLogRepository.save({ host, ip, agent });

    const tokens = this.utilsService.createTokens(host.id, host.name);
    await this.hostRepository.update(
      { id: host.id },
      { refreshToken: tokens.refreshToken },
    );

    return { ...tokens };
  }

  async refreshAccessToken(reqUser: ReqUser): Promise<Tokens> {
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
