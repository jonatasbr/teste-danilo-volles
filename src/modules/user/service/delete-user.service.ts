import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class DeleteUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(id: string) {
    const userExists = await this.userRepository.findOneBy({ id });
    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }
    userExists.active = false;
    return await this.userRepository.save(userExists);
  }
}
