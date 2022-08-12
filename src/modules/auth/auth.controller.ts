import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthInput } from './dto/auth.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RefreshTokenService } from './refresh-token.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authenticateService: AuthenticateService,
    private refreshRokenService: RefreshTokenService,
  ) {}

  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() data: AuthInput) {
    return await this.authenticateService.execute(data);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenInput) {
    const { refresh_token, user_id } = data;
    return await this.refreshRokenService.execute(refresh_token, user_id);
  }
}
