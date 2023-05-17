import { IsString } from 'class-validator';

export class SigninLogDto {
  @IsString()
  ip: string;

  @IsString()
  agent: string;
}
//interface or type
