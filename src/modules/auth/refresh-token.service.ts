import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserByIdService } from '../user/get-user-by-id.service';
import { UserToken } from './user-token.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private getUserByIdService: GetUserByIdService,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async execute(token: string, user_id: string): Promise<any> {
    const user = await this.getUserByIdService.execute(user_id);
    const user_token = await this.userTokenRepository.findOne({
      where: {
        user_id,
        refresh_token: token,
      },
    });
    if (!user_token) {
      throw new NotFoundException('Refresh token not found');
    }

    await this.userTokenRepository.delete(user_token.id);

    const payload = { email: user.email, user_id: user.id };
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    const new_user_token = this.userTokenRepository.create({
      refresh_token,
      user_id,
    });
    await this.userTokenRepository.save(new_user_token);
    return { refresh_token };
  }
}
