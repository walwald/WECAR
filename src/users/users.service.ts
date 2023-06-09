import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDto } from './dto/signup.user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { UserSigninLog } from './entities/user-signin-log.entity';
import { ReqUser, Tokens } from 'src/auth/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSigninLog)
    private usersigninLogRepository: Repository<UserSigninLog>,
    private readonly utilsService: UtilsService,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }
    return user;
  }

  async signup(userData: SignupUserDto): Promise<Tokens> {
    const { phoneNumber, email, driversLicenseNumber } = userData;

    const duplicateUser: User = await this.userRepository.findOne({
      where: [{ phoneNumber }, { email }, { driversLicenseNumber }],
    });

    if (duplicateUser)
      throw new UnauthorizedException(
        `Duplicate Email, Phone Number, or Dirver's License Number`,
      );

    const newUser = this.userRepository.create(userData);
    newUser.updatePassword(newUser.password);

    const tokens = this.utilsService.createTokens(newUser.id, newUser.name);
    newUser.refreshToken = tokens.refreshToken;

    await this.userRepository.save(newUser);

    return { ...tokens };
  }

  async signin(
    signinData: SigninAuthDto,
    ip: string,
    agent: string,
  ): Promise<Tokens> {
    const user = await this.findOneByEmail(signinData.email);

    await user.checkPassword(signinData.password);

    this.usersigninLogRepository.save({ user, ip, agent });

    const tokens = this.utilsService.createTokens(user.id, user.name);
    await this.userRepository.update(
      { id: user.id },
      { refreshToken: tokens.refreshToken },
    );

    return { ...tokens };
  }

  async refreshAccessToken(reqUser: ReqUser): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ id: reqUser.id });
    if (!user) throw new BadRequestException('User Not Found');

    if (user.refreshToken !== reqUser.refreshToken) {
      throw new BadRequestException('Invalid Refresh Token');
    }
    const tokens = this.utilsService.createTokens(user.id, user.name);
    await this.userRepository.update(
      { id: user.id },
      { refreshToken: tokens.refreshToken },
    );

    return { ...tokens };
  }
}
