import { defineStore } from 'pinia';

export const useGeneralStore = defineStore('general', {
  actions: {
    formatDate(dateString: string | null | undefined): string {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
});
