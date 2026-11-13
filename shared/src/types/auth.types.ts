export interface User {
  id: number;
  email: string;
  createdAt: string;
}
export interface AuthCredentialsDto {
  email: string;
  password: string;
}
export interface AuthResponseDto {
  user: User;
  token: string;
}
