import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthInput } from './dto/auth.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RefreshTokenService } from './refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authenticateService: AuthenticateService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() data: AuthInput) {
    return await this.authenticateService.execute(data);
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenInput) {
    const { refresh_token } = data;
    return await this.refreshTokenService.execute(refresh_token);
  }
}
