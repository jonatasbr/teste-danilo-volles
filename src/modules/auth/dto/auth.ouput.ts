import { User } from 'src/modules/user/user.entity';

export interface AuthOutput {
  user?: User;

  email: string;

  access_token: string;

  refresh_token: string;

  roles: string[];

  permissions: string[];
}
