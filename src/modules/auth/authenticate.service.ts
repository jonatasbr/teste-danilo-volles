import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AuthInput } from './dto/auth.input';
import { AuthOutput } from './dto/auth.ouput';
import { GetAccessTokenService } from './get-access-token.service';
import { GetRefreshTokenService } from './get-refresh-token.service';
import { UserToken } from './user-token.entity';

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private getAccessTokenService: GetAccessTokenService,
    private getRefreshTokenService: GetRefreshTokenService,
  ) {}

  async execute(data: AuthInput): Promise<AuthOutput> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email, active: true },
    });
    const passAgainstTimeAttack = user?.password || 'pass';
    const validPassword = await compare(password, passAgainstTimeAttack);

    if (user && validPassword) {
      delete user.password;
      const access_token = this.getAccessTokenService.execute(email, user.id);
      const refresh_token = this.getRefreshTokenService.execute(email);
      await this.saveRefreshToken(refresh_token, user.id);
      return {
        user,
        access_token,
        refresh_token,
      };
    }
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Credenciais inválidas',
      },
      HttpStatus.FORBIDDEN,
    );
  }

  private async saveRefreshToken(refresh_token: string, user_id: string) {
    const user_token = await this.userTokenRepository.insert({
      refresh_token,
      user_id,
    });
    return user_token;
  }
}
