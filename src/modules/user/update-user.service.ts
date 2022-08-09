import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/update-users.input';
import { User } from './user.entity';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(id: string, data: UpdateUserInput) {
    const userExists = await this.userRepository.findOneBy({ id });
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const userUpdated = await this.userRepository.save({ ...data });
    return userUpdated;
  }
}
