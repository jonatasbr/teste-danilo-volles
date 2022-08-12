import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AuthInput } from './dto/auth.input';
import { AuthOutput } from './dto/auth.ouput';
import { UserToken } from './user-token.entity';

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
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
      const access_token = this.getAccessToken(email, user.id);
      const refresh_token = this.getRefreshToken(email, user.id);
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

  private getAccessToken(email: string, user_id: string) {
    const payload = { email, sub: user_id };
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('TOKEN_EXPIRATION_TIME'),
    });
    return access_token;
  }

  private getRefreshToken(email: string, user_id: string) {
    const payload = { email, sub: user_id };
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    return refresh_token;
  }

  private async saveRefreshToken(refresh_token: string, user_id: string) {
    const user_token = await this.userTokenRepository.insert({
      refresh_token,
      user_id,
    });
    return user_token;
  }
}
