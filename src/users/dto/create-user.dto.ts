import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/)
  password: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsPhoneNumber('KR')
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly driversLicenseNumber: string;

  @IsDateString()
  @IsNotEmpty()
  readonly birthday: Date;
}
