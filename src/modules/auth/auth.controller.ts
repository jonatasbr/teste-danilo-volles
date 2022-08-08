import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthInput } from './dto/auth.input';

@Controller('auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateService) {}

  @Post('sign-in')
  async signIn(@Body() data: AuthInput) {
    return await this.authenticateService.execute(data);
  }
}
