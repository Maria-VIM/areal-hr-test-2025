import { defineStore } from 'pinia';
import type { History } from '@/modules/history/types/History.ts';
import { HistoryApi } from '@/modules/history/api';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    loading: false,
    history: [] as History[],
  }),
  actions: {
    async fetchHistory(entity: string, id: number) {
      try {
        this.loading = true;
        const response = await HistoryApi.getAll(entity, id);
        this.history = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
