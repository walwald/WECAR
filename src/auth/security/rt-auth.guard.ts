import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class RtAuthGuard extends NestAuthGuard('jwt-rt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, rt: any, Info: any) {
    if (err || !rt) {
      throw err || new UnauthorizedException(Info);
    }
    return rt;
  }
}
