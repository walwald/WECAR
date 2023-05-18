import {
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';

export class SignupHostDto extends SigninAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsBoolean()
  readonly marketingAgreement: boolean;
}
