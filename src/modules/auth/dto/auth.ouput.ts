import { User } from '../../../modules/user/user.entity';

export class AuthOutput {
  user: User;

  token: string;
}
