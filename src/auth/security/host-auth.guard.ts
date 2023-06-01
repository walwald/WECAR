import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class HostAuthGuard extends NestAuthGuard('jwt-host') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, host: any, Info: any) {
    console.log('err:', err, 'user: ', host, 'info: ', Info);
    if (err || !host) {
      throw err || new UnauthorizedException(Info);
    }
    return host;
  }
}
