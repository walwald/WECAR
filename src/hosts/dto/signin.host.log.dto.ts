import { IsObject } from 'class-validator';
import { SigninLogDto } from 'src/auth/dto/signin.log.dto';
import { Host } from '../entities/host.entity';

export class SigninHostLogDto extends SigninLogDto {
  @IsObject()
  readonly host: Host;
}
