import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { SigninAuthDto } from 'src/auth/dto/signin-auth.dto';

export class SignupUserDto extends SigninAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsPhoneNumber('KR')
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly driversLicenseNumber: string;

  @IsDateString()
  @IsNotEmpty()
  readonly birthday: Date;

  @IsBoolean()
  @IsNotEmpty()
  readonly marketingAgreement: boolean;
}
