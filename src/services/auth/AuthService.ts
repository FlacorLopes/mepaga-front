import { AxiosInstance } from 'axios';
import { api } from 'src/boot/axios';
import { AuthRequestDTO, AuthResponseDTO } from 'src/services/auth/dto/AuthDTO';
import { LocalStorage, Cookies } from 'quasar';

export interface IAuthService {
  login(params: AuthRequestDTO): Promise<AuthResponseDTO>;
  logout();
}

export class AuthService implements IAuthService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  async login(params: AuthRequestDTO): Promise<AuthResponseDTO> {
    const response = await this.api.post('api/auth/local', params);

    if (response.status !== 200) throw new Error(response.statusText);

    (this.api.defaults.headers as { Authorization: string })['Authorization'] =
      'Bearer ' + (response.data as AuthResponseDTO).jwt;
    return response.data as AuthResponseDTO;
  }

  async googleLogin(access_token: string): Promise<AuthResponseDTO> {
    const response = await this.api.get(
      `${process.env.API_URL}api/auth/google/callback?access_token=${access_token}`
    );

    if (response.status !== 200) throw new Error(response.statusText);
    const authResponse = response.data as AuthResponseDTO;

    (this.api.defaults.headers as { Authorization: string })['Authorization'] =
      'Bearer ' + authResponse.jwt;

    try {
      LocalStorage.set('authentication', {
        jwt: authResponse.jwt,
        user: authResponse.user,
      } as AuthResponseDTO);
    } catch (error) {
      console.log(error);
    }

    return response.data as AuthResponseDTO;
  }

  async generateSecret(): Promise<{ secret: string; email: string }> {
    const response = await this.api.post(
      'api/users-permissions/generateSecret'
    );

    if (response.status !== 200) throw new Error(response.statusText);

    return response.data as { secret: string; email: string };
  }

  async confirmSecretGeneration(secret: string): Promise<void> {
    const response = await this.api.post(
      'api/users-permissions/confirmSecretGeneration',
      {
        data: {
          secret: secret,
        },
      }
    );

    if (response.status !== 200) throw new Error(response.statusText);
  }
  setSecretCookie(secret: string) {
    Cookies.set('mepaga_secret', secret, {
      expires: 30,
      sameSite: 'Strict',
      path: '/',
    });
  }
  logout() {
    (this.api.defaults.headers as { Authorization: string })['Authorization'] =
      null;
    LocalStorage.remove('authentication');
    Cookies.remove('mepaga_secret', {
      path: '/',
    });
  }
}
