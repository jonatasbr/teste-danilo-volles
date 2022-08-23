import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserToken } from './entity/user-token.entity';
import { GetUserByIdService } from '../user/service/get-user-by-id.service';
import { AuthenticateService } from './service/authenticate.service';
import { RefreshTokenService } from './service/refresh-token.service';
import { GetAccessTokenService } from './service/get-access-token.service';
import { GetRefreshTokenService } from './service/get-refresh-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthenticateService,
    JwtStrategy,
    RefreshTokenService,
    GetUserByIdService,
    GetAccessTokenService,
    GetRefreshTokenService,
  ],
})
export class AuthModule {}
