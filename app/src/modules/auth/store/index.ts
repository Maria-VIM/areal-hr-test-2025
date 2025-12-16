import { defineStore } from 'pinia';
import type { UserAuth } from '@/modules/auth/types/UserAuth.ts';
import type { LoginForm } from '@/modules/auth/types/LoginForm.ts';
import { AuthApi } from '@/modules/auth/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    user: null as UserAuth | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    roleId: (state) => state.user?.role_id ?? null,
  },
  actions: {
    async login(body: LoginForm): Promise<boolean> {
      try {
        this.loading = true;
        await AuthApi.logIn(body);
        const user = await this.getCurrentUser();
        return !!user;
      } catch (error) {
        this.user = null;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        this.loading = true;
        await AuthApi.logOut();
        this.user = null;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getCurrentUser(): Promise<UserAuth | null> {
      try {
        const response = await AuthApi.getUserInfo();
        this.user = response.data;
        return response.data;
      } catch (error) {
        this.user = null;
        return null;
      }
    },
    async checkAuth() {
      return await this.getCurrentUser();
    },
  },
});
