import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Host } from './entities/host.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupHostDto } from './dto/signup.host.dto';
import { Tokens } from 'src/auth/dto/token-related.interface';
import { UtilsService } from 'src/utils/utils.service';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { HostSigninLog } from './entities/host-signin.log.entity';

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

  async signup(userData: SignupHostDto): Promise<Tokens> {
    const { name, phoneNumber, email, password, marketingAgreement } = userData;

    const duplicateHost: Host = await this.hostRepository.findOne({
      where: [{ phoneNumber }, { email }],
    });

    if (duplicateHost)
      throw new UnauthorizedException(`Duplicate Email or Phone Number`);

    const newHost = new Host();

    newHost.phoneNumber = phoneNumber;
    newHost.email = email;
    newHost.name = name;
    newHost.marketingAgreement = marketingAgreement;
    newHost.updatePassword(password);

    await this.hostRepository.save(newHost);

    return this.utilsService.createTokens(newHost.id, newHost.name);
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
}
