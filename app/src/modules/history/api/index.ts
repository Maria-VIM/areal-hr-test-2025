import { api } from '@/shared/api';

export const HistoryApi = {
  getAll(entity: string, id: number) {
    return api.get(`history/${entity}/${id}`);
  },
};
