import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   return super.canActivate(context);
  // }
  handleRequest(err: any, user: any) {
    // 에러가 발생하거나 토큰이 만료된 경우 여기에서 처리합니다.
    console.log('여기는 authguard: ', err);
    if (err || !user) {
      throw err || new UnauthorizedException('Token has expired');
    }
    return user;
  }
}
