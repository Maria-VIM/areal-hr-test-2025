import { api } from '@/shared/api';

export const OrganizationApi = {
  getAll() {
    return api.get('/organization');
  },
  getById(id: number) {
    return api.get(`/organization/id/${id}`);
  },
  delete(id: number) {
    return api.delete(`/organization/${id}`);
  },
  restore(id: number) {
    const body = {
      deleted_at: null,
    };
    return api.patch(`/organization/${id}`, body);
  },
  update(id: number, body: any) {
    return api.patch(`/organization/${id}`, body);
  },
  create(body: any) {
    return api.post('/organization', body);
  },
};
