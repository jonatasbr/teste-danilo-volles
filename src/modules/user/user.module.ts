import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { User } from './entity/user.entity';
import { CreateUserService } from './service/create-user.service';
import { ListUserService } from './service/list-user.service';
import { GetUserByIdService } from './service/get-user-by-id.service';
import { UpdateUserService } from './service/update-user.service';
import { DeleteUserService } from './service/delete-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    ListUserService,
    GetUserByIdService,
    CreateUserService,
    UpdateUserService,
    DeleteUserService,
  ],
})
export class UserModule {}
