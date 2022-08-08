import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { CreateUserService } from './create-user.service';
import { ListUserService } from './list-user.service';
import { GetUserByIdService } from './get-user-by-id.service';
import { UpdateUserService } from './update-user.service';
import { DeleteUserService } from './delete-user.service';

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
