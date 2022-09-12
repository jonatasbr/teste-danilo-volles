import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../modules/user/entity/user.entity';

@Injectable()
export class GetAccessTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  execute(user: User) {
    const payload = { user };
    console.log('ACCESS TOKEN');
    console.log(payload);
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('TOKEN_EXPIRATION_TIME'),
    });
    return access_token;
  }
}
