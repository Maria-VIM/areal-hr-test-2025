import { api } from '@/shared/api';
import type { LoginForm } from '@/modules/auth/types/LoginForm.ts';

export const AuthApi = {
  logIn(body: LoginForm) {
    return api.post('/auth/login', body);
  },
  logOut() {
    return api.post('/auth/logout');
  },
  getUserInfo() {
    return api.get('/auth/user');
  },
};
