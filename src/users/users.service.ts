import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDto } from './dto/signup.user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { Tokens } from 'src/auth/dto/token-related.interface';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';
import { UserSigninLog } from './entities/user-signin-log.entity';

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

  //주석 작성 메서드용 주석 JS Doc
  async signup(userData: SignupUserDto): Promise<Tokens> {
    const {
      name,
      phoneNumber,
      email,
      driversLicenseNumber,
      password,
      birthday,
      marketingAgreement,
    } = userData;

    const duplicateUser: User = await this.userRepository.findOne({
      where: [{ phoneNumber }, { email }, { driversLicenseNumber }],
    });

    if (duplicateUser)
      throw new UnauthorizedException(
        `Duplicate Email, Phone Number, or Dirver's License Number`,
      );

    const newUser = new User();

    newUser.phoneNumber = phoneNumber;
    newUser.birthday = birthday;
    newUser.driversLicenseNumber = driversLicenseNumber;
    newUser.email = email;
    newUser.name = name;
    newUser.marketingAgreement = marketingAgreement;
    newUser.updatePassword(password);

    await this.userRepository.save(newUser);

    return this.utilsService.createTokens(newUser.id, newUser.name);
  }

  //subscriber - user가 insert되면 다음 절차가 next afterupdate 같은 거 쓸 수 있음 afterinsert
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
}
