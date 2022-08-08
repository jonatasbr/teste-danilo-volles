import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthInput {
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail inválido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  password: string;
}
