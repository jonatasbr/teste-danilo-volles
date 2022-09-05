import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { AuthOutput } from '../dto/auth.dto';
import { GetAccessTokenService } from './get-access-token.service';
import { GetRefreshTokenService } from './get-refresh-token.service';
import { UserToken } from '../entity/user-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private getAccessTokenService: GetAccessTokenService,
    private getRefreshTokenService: GetRefreshTokenService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async execute(token: string): Promise<AuthOutput> {
    const user_token = await this.userTokenRepository.find({
      where: {
        refresh_token: token,
      },
    });
    if (!user_token) {
      throw new NotFoundException('Refresh token not found');
    }
    const user = await this.userRepository.findOneBy({
      id: user_token[0].user_id,
    });
    if (!user) {
      throw new NotFoundException('Refresh token not found');
    }

    await this.userTokenRepository.delete(user_token[0].id);
    const access_token = this.getAccessTokenService.execute(user);
    const refresh_token = this.getRefreshTokenService.execute(user.email);
    const new_user_token = this.userTokenRepository.create({
      refresh_token,
      user_id: user.id,
    });
    await this.userTokenRepository.save(new_user_token);

    return {
      user,
      access_token,
      refresh_token,
    };
  }
}
