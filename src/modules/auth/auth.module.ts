import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthenticateService } from './authenticate.service';
import { RefreshTokenService } from './refresh-token.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserToken } from './user-token.entity';
import { GetUserByIdService } from '../user/get-user-by-id.service';
import { GetAccessTokenService } from './get-access-token.service';
import { GetRefreshTokenService } from './get-refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthenticateService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenService,
    GetUserByIdService,
    GetAccessTokenService,
    GetRefreshTokenService,
  ],
})
export class AuthModule {}
