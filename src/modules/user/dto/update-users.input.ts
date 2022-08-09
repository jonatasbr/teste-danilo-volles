import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserInput {
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Caracteres inválidos' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
