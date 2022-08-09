import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthInput } from './dto/auth.input';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('sign-in')
  async signIn(@Body() data: AuthInput) {
    return await this.authenticateService.execute(data);
  }
}
