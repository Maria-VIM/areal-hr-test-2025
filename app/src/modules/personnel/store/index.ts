import { defineStore } from 'pinia';
import { PersonnelApi } from '@/modules/personnel/api';
import type { PersonnelOperation } from '@/modules/personnel/types/Personnel.ts';

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    operations: [] as any[],
    operation: null as any,
    loading: false,
  }),
  actions: {
    async fetchPersonnelList(employee_id: number) {
      try {
        this.loading = true;
        const response = await PersonnelApi.getAllByEmployeeId(employee_id);
        this.operations = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.log(error);
        alert('Cannot load personnel operation');
      } finally {
        this.loading = false;
      }
    },
    async getPersonnelOperationById(id: number): Promise<PersonnelOperation | null> {
      try {
        this.loading = true;
        const response = await PersonnelApi.getById(id);
        this.operation = response.data;
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot get personnel operation');
        return null;
      } finally {
        this.loading = false;
      }
    },
    async delete(id: number): Promise<void> {
      if (!confirm('Are you sure you want to delete this personnel operation?')) return;
      try {
        this.loading = true;
        const response = await PersonnelApi.delete(id);
      } catch (error) {
        console.log(error);
        alert('Cannot delete personnel');
      } finally {
        this.loading = false;
      }
    },
    async create(body: any): Promise<void> {
      try {
        this.loading = true;
        await PersonnelApi.create(body);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async update(id: number, body: any): Promise<void> {
      try {
        this.loading = true;
        await PersonnelApi.update(id, body);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
