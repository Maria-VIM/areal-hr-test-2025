import { defineStore } from 'pinia';
import { PersonnelApi } from '@/modules/personnel/api';
import type { PersonnelOperation } from '@/modules/personnel/types/Personnel.ts';
import type { PersonnelOperationForm } from '@/modules/personnel/types/PersonnelForm.ts';

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    operations: [] as PersonnelOperation[],
    operation: null as PersonnelOperation | null,
    loading: false,
    version: 0,
  }),
  actions: {
    incrementVersion() {
      this.version++;
    },

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
    async deletePersonnelOperation(id: number): Promise<void> {
      if (!confirm('Are you sure you want to delete this personnel operation?')) return;
      try {
        this.loading = true;
        await PersonnelApi.delete(id);
        this.incrementVersion();
      } catch (error) {
        console.log(error);
        alert('Cannot delete personnel');
      } finally {
        this.loading = false;
      }
    },
    async createPersonnelOperation(body: PersonnelOperationForm): Promise<void> {
      try {
        this.loading = true;
        await PersonnelApi.create(body);
        this.incrementVersion();
      } catch (error) {
        alert('Cannot create personnel operation');
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async updatePersonnelOperation(id: number, body: PersonnelOperationForm): Promise<void> {
      try {
        this.loading = true;
        await PersonnelApi.update(id, body);
        this.incrementVersion();
      } catch (error) {
        alert('Cannot update personnel operation');
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
