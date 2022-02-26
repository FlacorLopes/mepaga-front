import { User } from 'src/services/auth/dto/AuthDTO';

export interface AuthStateInterface {
  loading: boolean;
  isLoggedIn: boolean;
  user?: Pick<User, 'username' | 'email' | 'displayName'>;
  token?: {
    access_token: string;
  };
}

function state(): AuthStateInterface {
  return {
    loading: false,
    isLoggedIn: false,
    user: null,
    token: null,
  };
}

export default state;
