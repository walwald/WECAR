import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/)
  password: string;
}
