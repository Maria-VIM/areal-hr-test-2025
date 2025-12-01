import { api } from '@/shared/api';

export const jobApi = {
  getAllJobs() {
    return api.get('/job');
  },
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
    return api.patch(`/job/restore/${id}`, {});
  },
  update(id: number, body: any) {
    return api.patch(`/job/${id}`, body);
  },
  delete(id: number) {
    return api.delete(`/job/${id}`);
  },
};
