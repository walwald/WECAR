import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAuthGuard extends NestAuthGuard('jwt-user') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, Info: any) {
    console.log('err:', err, 'user: ', user, 'info: ', Info);
    if (err || !user) {
      throw err || new UnauthorizedException(Info);
    }
    return user;
  }
}
