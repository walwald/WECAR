import { IsBoolean, IsPhoneNumber, IsString } from 'class-validator';
import { SigninAuthDto } from 'src/auth/dto/signin.auth.dto';

export class SignupHostDto extends SigninAuthDto {
  @IsString()
  readonly name: string;

  @IsPhoneNumber('KR')
  readonly phoneNumber: string;

  @IsBoolean()
  readonly marketingAgreement: boolean;
}
