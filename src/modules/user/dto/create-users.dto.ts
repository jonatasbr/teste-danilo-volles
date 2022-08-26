import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'E-mail inválido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  password: string;
}
