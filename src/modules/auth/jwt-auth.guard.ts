import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    if (info instanceof TokenExpiredError) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          code: 'access-token.expired',
          message: 'Token expirou',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
