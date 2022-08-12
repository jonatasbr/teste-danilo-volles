import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshTokenInput {
  @IsNotEmpty({ message: 'Token inválido' })
  refresh_token: string;

  @IsUUID()
  user_id: string;
}
