import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-users.input';
import { User } from './user.entity';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(data: CreateUserInput) {
    const { email } = data;
    const userAlreadyExists = await this.userRepository.findOneBy({ email });
    if (userAlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'E-mail já cadastrado',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.userRepository.save(data);
  }
}
