import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthInput } from '../dto/auth.dto';
import { RefreshTokenInput } from '../dto/refresh-token.dto';
import { AuthenticateService } from '../service/authenticate.service';
import { RefreshTokenService } from '../service/refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authenticateService: AuthenticateService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() data: AuthInput) {
    const output = await this.authenticateService.execute(data);
    return output;
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenInput) {
    const { refresh_token } = data;
    return await this.refreshTokenService.execute(refresh_token);
  }
}
