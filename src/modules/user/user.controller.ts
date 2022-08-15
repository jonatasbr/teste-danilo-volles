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
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { DeleteUserService } from './delete-user.service';
import { GetUserByIdService } from './get-user-by-id.service';
import { ListUserService } from './list-user.service';
import { UpdateUserService } from './update-user.service';
import { CreateUserInput } from './dto/create-users.input';
import { UpdateUserInput } from './dto/update-users.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private listUserService: ListUserService,
    private getUserByIdService: GetUserByIdService,
    private updateUserByIdService: UpdateUserService,
    private deleteUserByIdService: DeleteUserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return await this.getUserByIdService.execute(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page')
    page = 1,
    @Query('per_page')
    per_page = 10,
  ) {
    const limit = per_page;
    const offset = (page - 1) * limit;
    const users = await this.listUserService.execute(offset, limit);
    return users;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() data: UpdateUserInput) {
    const user = await this.updateUserByIdService.execute(id, data);
    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.deleteUserByIdService.execute(id);
    return user;
  }
}
