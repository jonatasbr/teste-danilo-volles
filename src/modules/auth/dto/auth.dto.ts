import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entity/user.entity';

export class AuthInput {
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail inválido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  password: string;
}

export interface AuthOutput {
  user?: User;

  email: string;

  access_token: string;

  refresh_token: string;

  roles: string[];

  permissions: string[];
}
