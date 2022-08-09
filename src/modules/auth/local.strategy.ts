import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthOutput } from './dto/auth.ouput';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticateService: AuthenticateService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<AuthOutput> {
    return await this.authenticateService.execute({ email, password });
  }
}
