import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinData: SigninAuthDto) {
    return this.authService.signin(signinData);
  }
}
