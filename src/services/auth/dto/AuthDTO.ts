export interface AuthRequestDTO {
  identifier: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  provider: string;
  confirmed: boolean;
  hasGeneratedSecret: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDTO {
  jwt: string;
  user: User;
}
