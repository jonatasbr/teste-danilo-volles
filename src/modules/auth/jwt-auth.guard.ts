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
          status: HttpStatus.FORBIDDEN,
          error: 'Token expired',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
