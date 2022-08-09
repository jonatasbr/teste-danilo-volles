import { User } from 'src/modules/user/user.entity';

export interface AuthOutput {
  user: User;

  token: string;
}
