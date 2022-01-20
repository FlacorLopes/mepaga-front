import { User } from 'src/services/auth/dto/AuthDTO';

export interface AuthStateInterface {
  loading: boolean;
  isLoggedIn: boolean;
  user?: Pick<User, 'username' | 'email'>;
}

function state(): AuthStateInterface {
  return {
    loading: false,
    isLoggedIn: false,
    user: null,
  };
}

export default state;
