import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserService } from '../service/create-user.service';
import { DeleteUserService } from '../service/delete-user.service';
import { GetUserByIdService } from '../service/get-user-by-id.service';
import { ListUserService } from '../service/list-user.service';
import { UpdateUserService } from '../service/update-user.service';
import { CreateUserInput } from '../dto/create-users.dto';
import { UpdateUserInput } from '../dto/update-users.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { User } from '../entity/user.entity';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private listUserService: ListUserService,
    private getUserByIdService: GetUserByIdService,
    private updateUserByIdService: UpdateUserService,
    private deleteUserByIdService: DeleteUserService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornado com sucesso',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getProfile(@Request() req: any) {
    return await this.getUserByIdService.execute(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: User,
  })
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
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Deve ser um id do tipo uuid registrado no banco de dados',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornado com sucesso',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.getUserByIdService.execute(id);
    return user;
  }

  @Post()
  @HttpCode(201)
  @ApiBody({ type: CreateUserInput })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: User,
  })
  async create(@Body() data: CreateUserInput) {
    const user = await this.createUserService.execute(data);
    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Deve ser um id do tipo uuid registrado no banco de dados',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário alterado com sucesso',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async update(@Param('id') id: string, @Body() data: UpdateUserInput) {
    const user = await this.updateUserByIdService.execute(id, data);
    return user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Deve ser um id do tipo uuid registrado no banco de dados',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário desativado com sucesso - exclusão lógica',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.deleteUserByIdService.execute(id);
    return user;
  }
}
