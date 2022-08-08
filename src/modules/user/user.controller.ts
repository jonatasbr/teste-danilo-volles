import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { DeleteUserService } from './delete-user.service';
import { CreateUserInput } from './dto/create-users.input';
import { UpdateUserInput } from './dto/update-users.input';
import { GetUserByIdService } from './get-user-by-id.service';
import { ListUserService } from './list-user.service';
import { UpdateUserService } from './update-user.service';

@Controller('users')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private listUserService: ListUserService,
    private getUserByIdService: GetUserByIdService,
    private updateUserByIdService: UpdateUserService,
    private deleteUserByIdService: DeleteUserService,
  ) {}

  @Get()
  async findAll(
    @Param('page')
    page = 1,
    @Param('per_page')
    per_page = 10,
  ) {
    const limit = per_page;
    const offset = (page - 1) * limit;
    const users = await this.listUserService.execute(offset, limit);
    return users;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.getUserByIdService.execute(id);
    return user;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateUserInput) {
    const user = await this.createUserService.execute(data);
    return user;
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('data') data: UpdateUserInput,
  ) {
    const user = await this.updateUserByIdService.execute(id, data);
    return user;
  }

  @Patch(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.deleteUserByIdService.execute(id);
    return user;
  }
}
