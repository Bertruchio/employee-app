import { API_ENDPOINTS } from '@shared/constants';
import type { AuthCredentialsDto, AuthResponseDto, User } from '@shared/types/auth.types';
import { apiRequest } from './api.client';

export const authApi = Object.freeze({
  register: (dto: AuthCredentialsDto): Promise<AuthResponseDto> =>
    apiRequest<AuthResponseDto>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: dto,
    }),

  login: (dto: AuthCredentialsDto): Promise<AuthResponseDto> =>
    apiRequest<AuthResponseDto>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: dto,
    }),

  logout: (): Promise<void> =>
    apiRequest<void>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    }),

  me: (): Promise<User> => apiRequest<User>(API_ENDPOINTS.AUTH.ME),
});
