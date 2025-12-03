import { defineStore } from 'pinia';
import type { FileItem } from '../types/File.ts';
import { fileApi } from '@/modules/files/api';

export const useFileStore = defineStore('file', {
  state: () => ({
    loading: false,
    files: [] as FileItem[],
    file: null as FileItem | null,
    version: 0,
  }),

  actions: {
    incrementVersion() {
      this.version++;
    },

    async fetchFiles(employee_id: number) {
      try {
        this.loading = true;
        const { data } = await fileApi.getAllFiles(employee_id);
        this.files = data || [];
      } catch (error) {
        console.error('Ошибка при загрузке файлов:', error);
      } finally {
        this.loading = false;
      }
    },

    async downloadFile(id: number, filename?: string) {
      try {
        const response = await fileApi.downloadFile(id);
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || 'file');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
    },

    async deleteFile(id: number) {
      try {
        this.loading = true;
        await fileApi.delete(id);
        this.files = this.files.filter((f) => f.id !== id);
        this.incrementVersion();
      } catch (error) {
        console.error('Ошибка при удалении файла:', error);
      } finally {
        this.loading = false;
      }
    },

    async uploadFile(formData: FormData) {
      try {
        this.loading = true;
        const response = await fileApi.uploadFile(formData);
        this.files.push(response.data.data);
        this.incrementVersion();
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
