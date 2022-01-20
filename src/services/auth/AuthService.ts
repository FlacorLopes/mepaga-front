import { AxiosInstance } from 'axios';
import { api } from 'src/boot/axios';
import { AuthRequestDTO, AuthResponseDTO } from 'src/services/auth/dto/AuthDTO';

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

    (this.api.defaults.headers as { Authorization: any })['Authorization'] =
      'Bearer ' + (response.data as AuthResponseDTO).jwt;
    return response.data as AuthResponseDTO;
  }

  logout() {
    (this.api.defaults.headers as { Authorization: any })['Authorization'] =
      null;
  }
}
