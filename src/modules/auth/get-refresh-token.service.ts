import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './user-token.entity';

@Injectable()
export class GetRefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async execute(email: string, user_id: string): Promise<string> {
    const payload = { email };
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    const user_token = this.userTokenRepository.create({
      refresh_token,
      user_id,
    });
    await this.userTokenRepository.save(user_token);
    return refresh_token;
  }
}
