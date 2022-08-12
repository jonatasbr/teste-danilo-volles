import { User } from 'src/modules/user/user.entity';

export interface AuthOutput {
  user: User;

  access_token: string;

  refresh_token: string;
}
