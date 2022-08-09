import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AuthInput } from './dto/auth.input';
import { AuthOutput } from './dto/auth.ouput';

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
        user,
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
}
