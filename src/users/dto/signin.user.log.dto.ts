import { IsObject } from 'class-validator';
import { SigninLogDto } from 'src/auth/dto/signin.log.dto';
import { User } from '../entities/user.entity';

export class SigninUserLogDto extends SigninLogDto {
  @IsObject()
  readonly user: User;
}
