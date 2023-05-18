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
  readonly phoneNumber: string;

  @IsString()
  readonly driversLicenseNumber: string;

  @IsDateString()
  readonly birthday: Date;

  @IsBoolean()
  readonly marketingAgreement: boolean;
}

//IsNotEmpty() 같은 벨리데이터 추가
