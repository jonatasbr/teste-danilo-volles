import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserByIdService } from '../user/get-user-by-id.service';
import { GetAccessTokenService } from './get-access-token.service';
import { GetRefreshTokenService } from './get-refresh-token.service';
import { UserToken } from './user-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private getAccessTokenService: GetAccessTokenService,
    private getRefreshTokenService: GetRefreshTokenService,
    private getUserByIdService: GetUserByIdService,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async execute(token: string): Promise<any> {
    const user_token = await this.userTokenRepository.findOneBy({
      refresh_token: token,
    });
    if (!user_token) {
      throw new NotFoundException('Refresh token not found');
    }
    const user = await this.getUserByIdService.execute(user_token.user_id);
    if (!user) {
      throw new NotFoundException('Refresh token not found');
    }

    await this.userTokenRepository.delete(user_token.id);

    const access_token = this.getAccessTokenService.execute(
      user.email,
      user.id,
    );
    const refresh_token = this.getRefreshTokenService.execute(user.email);
    const new_user_token = this.userTokenRepository.create({
      refresh_token,
      user_id: user.id,
    });
    await this.userTokenRepository.save(new_user_token);
    return { access_token, refresh_token };
  }
}
