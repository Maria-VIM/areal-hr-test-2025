import { api } from '@/shared/api';
import type { JobForm } from '@/modules/job/types/JobForm.ts';

export const jobApi = {
  getAll(page: number, pageSize: number) {
    return api.get(`/job/?page=${page}&pageSize=${pageSize}`);
  },
  getAllActiveJobs() {
    return api.get('/job/active');
  },
  getById(id: number) {
    return api.get(`/job/id/${id}`);
  },
  getByName(name: string, page: number, pageSize: number) {
    return api.get(`/job/name/${name}/?page=${page}&pageSize=${pageSize}`);
  },
  create(body: JobForm) {
    return api.post(`/job`, body);
  },
  restore(id: number) {
    return api.patch(`/job/restore/${id}`, {});
  },
  update(id: number, body: JobForm) {
    return api.patch(`/job/${id}`, body);
  },
  delete(id: number) {
    return api.delete(`/job/${id}`);
  },
};
