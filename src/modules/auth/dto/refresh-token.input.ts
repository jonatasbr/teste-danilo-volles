import { IsNotEmpty } from 'class-validator';

export class RefreshTokenInput {
  @IsNotEmpty({ message: 'Token inválido' })
  refresh_token: string;
}
