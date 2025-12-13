import { defineStore } from 'pinia';
import type { Users } from '@/modules/users/types/User.ts';
import { UserApi } from '@/modules/users/api';
import type { Role } from '@/modules/users/types/Role.ts';
import type { UserForm } from '@/modules/users/types/UserForm.ts';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as Users[],
    user: null as Users | null,
    roles: [] as Role[],
    loading: false,
    version: 0,
  }),
  actions: {
    incrementVersion() {
      this.version++;
    },
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await UserApi.getAllUsers();
        this.users = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.error(error);
        alert('Cannot load users');
      } finally {
        this.loading = false;
      }
    },
    async fetchRoles() {
      try {
        this.loading = true;
        const response = await UserApi.getAllRoles();
        this.roles = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.error(error);
        alert('Cannot load roles');
      } finally {
        this.loading = false;
      }
    },
    async getById(id: number) {
      try {
        this.loading = true;
        const response = await UserApi.getById(id);
        this.user = response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot load user by id');
      } finally {
        this.loading = false;
      }
    },
    async delete(id: number) {
      try {
        this.loading = true;
        await UserApi.delete(id);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot delete user by id');
      } finally {
        this.loading = false;
      }
    },
    async create(employee_id: number, body: UserForm) {
      try {
        this.loading = true;
        const response = await UserApi.create(body);
        const userId = response.data.id;
        if (userId) {
          await UserApi.updateEmployee(employee_id, userId);
        }
        this.incrementVersion();
      } catch (error: any) {
        if (error.response?.status === 409) {
          return {
            success: false,
            error: 'Этот логин уже занят. Выберите другой.',
          };
        }
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async update(id: number, body: UserForm) {
      try {
        this.loading = true;
        await UserApi.update(id, body);
        this.incrementVersion();
      } catch (error: any) {
        if (error.response?.status === 409) {
          return {
            success: false,
            error: 'Этот логин уже занят. Выберите другой.',
          };
        }
        console.error(error);
        alert('Cannot update user by id');
      } finally {
        this.loading = false;
      }
    },
    async activation(id: number) {
      try {
        this.loading = true;
        await UserApi.activation(id);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot activation user profile by id');
      } finally {
        this.loading = false;
      }
    },
    async deactivation(id: number) {
      try {
        this.loading = true;
        await UserApi.deactivation(id);
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot deactivation user profile by id');
      } finally {
        this.loading = false;
      }
    },
  },
});
