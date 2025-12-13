import { api } from '@/shared/api';
import type { UserForm } from '@/modules/users/types/UserForm.ts';

export const UserApi = {
  getAllUsers() {
    return api.get('/user');
  },
  getAllRoles() {
    return api.get('/user/roles');
  },
  getById(id: number) {
    return api.get(`/user/id/${id}`);
  },
  create(body: UserForm) {
    return api.post('/user', body);
  },
  delete(id: number) {
    return api.delete(`/user/${id}`);
  },
  update(id: number, body: UserForm) {
    return api.patch(`/user/id/${id}`, body);
  },
  activation(id: number) {
    return api.patch(`/user/activation/${id}`, {});
  },
  deactivation(id: number) {
    return api.patch(`/user/deactivation/${id}`, {});
  },
  updateEmployee(id: number, id_user: number) {
    return api.patch(`/employee/${id}`, { user_id: id_user });
  },
};
