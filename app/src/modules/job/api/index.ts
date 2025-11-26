import { api } from '@/shared/api';

export const jobApi = {
  getById(id: number) {
    return api.get(`/job/id/${id}`);
  },
  getByName(name: string) {
    return api.get(`/job/name/${name}`);
  },
  create(body: any) {
    return api.post(`/job`, body);
  },
  restore(id: number) {
    return api.patch(`/job/${id}`, { deleted_at: null });
  },
  update(id: number, body: any) {
    return api.patch(`/job/${id}`, body);
  },
  delete(id: number) {
    return api.delete(`/job/${id}`);
  },
};
