import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/)
  password: string;

  @IsString()
  @IsOptional()
  passwordSalt: string;
}
