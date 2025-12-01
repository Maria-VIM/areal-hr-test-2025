import { api } from '@/shared/api';

export const departmentsApi = {
  getAll(organization_id: number) {
    return api.get(`/department/organization/${organization_id}`);
  },
  getAllActive(organization_id: number) {
    return api.get(`/department/active/organization/${organization_id}`);
  },
  getById(id: number) {
    return api.get(`/department/id/${id}`);
  },
  delete(id: number) {
    return api.delete(`/department/${id}`);
  },
  create(body: any) {
    return api.post(`/department`, body);
  },
  restore(id: number) {
    return api.patch(`/department/restore/${id}`, {});
  },
  update(id: number, body: any) {
    return api.patch(`/department/${id}`, body);
  },
};
