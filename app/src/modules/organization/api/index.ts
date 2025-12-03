import { api } from '@/shared/api';
import type { OrganizationForm } from '@/modules/organization/types/OrganizationForm.ts';

export const OrganizationApi = {
  getAll() {
    return api.get('/organization');
  },
  getAllActive() {
    return api.get('/organization/active');
  },
  getById(id: number) {
    return api.get(`/organization/id/${id}`);
  },
  delete(id: number) {
    return api.delete(`/organization/${id}`);
  },
  restore(id: number) {
    return api.patch(`/organization/restore/${id}`, {});
  },
  update(id: number, body: OrganizationForm) {
    return api.patch(`/organization/${id}`, body);
  },
  create(body: OrganizationForm) {
    return api.post('/organization', body);
  },
};
