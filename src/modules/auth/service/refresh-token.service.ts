import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserByIdService } from '../../user/service/get-user-by-id.service';
import { User } from '../../user/entity/user.entity';
import { AuthOutput } from '../dto/auth.ouput';
import { GetAccessTokenService } from './get-access-token.service';
import { GetRefreshTokenService } from './get-refresh-token.service';
import { UserToken } from '../entity/user-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private getAccessTokenService: GetAccessTokenService,
    private getRefreshTokenService: GetRefreshTokenService,
    private getUserByIdService: GetUserByIdService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async execute(token: string): Promise<AuthOutput> {
    const user_token = await this.userTokenRepository.findOneBy({
      refresh_token: token,
    });
    if (!user_token) {
      throw new NotFoundException('Refresh token not found');
    }
    const user = await this.userRepository.findOneBy({
      id: user_token.user_id,
    });
    if (!user) {
      throw new NotFoundException('Refresh token not found');
    }

    await this.userTokenRepository.delete(user_token.id);

    const roles = ['administrator'];
    const permissions = ['users.list', 'users.create'];
    const access_token = this.getAccessTokenService.execute(
      user.email,
      user.id,
      roles,
      permissions,
    );
    const refresh_token = this.getRefreshTokenService.execute(user.email);
    const new_user_token = this.userTokenRepository.create({
      refresh_token,
      user_id: user.id,
    });
    await this.userTokenRepository.save(new_user_token);

    return {
      email: user.email,
      access_token,
      refresh_token,
      roles,
      permissions,
    };
  }
}
