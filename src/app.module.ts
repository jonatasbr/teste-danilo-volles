import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Yup from 'yup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Yup.object({
        API_PORT: Yup.string().required(),
        TOKEN_EXPIRATION_TIME: Yup.string().required(),
        ACCESS_TOKEN_SECRET: Yup.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Yup.string().required(),
        REFRESH_TOKEN_SECRET: Yup.string().required(),
        DB_POSTGRESQL_HOST: Yup.string().required(),
        DB_POSTGRESQL_DBNAME: Yup.string().required(),
        DB_POSTGRESQL_USER: Yup.string().required(),
        DB_POSTGRESQL_PASSWORD: Yup.string().required(),
        DB_POSTGRESQL_PORT: Yup.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_POSTGRESQL_HOST,
      port: Number(process.env.DB_POSTGRESQL_PORT),
      username: process.env.DB_POSTGRESQL_USER,
      password: process.env.DB_POSTGRESQL_PASSWORD,
      database: process.env.DB_POSTGRESQL_DBNAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
