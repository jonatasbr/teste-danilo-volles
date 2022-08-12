import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GetAccessTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string, user_id: string): Promise<string> {
    const payload = { email, sub: user_id };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('TOKEN_EXPIRATION_TIME'),
    });
    return access_token;
  }
}
