import { defineStore } from 'pinia';
import { departmentsApi } from '@/modules/departments/api';
import type { Department } from '@/modules/departments/types/Department.ts';
import type { DepartmentForm } from '@/modules/departments/types/DepartmentForm.ts';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    loading: false,
    departments: [] as Department[],
    department: null as Department | null,
    version: 0,
  }),
  actions: {
    incrementVersion() {
      this.version++;
    },

    async fetchDepartments(organization_id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await departmentsApi.getAll(organization_id);
        this.departments = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot load departments');
      } finally {
        this.loading = false;
      }
    },
    async fetchActiveDepartments(organization_id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await departmentsApi.getAllActive(organization_id);
        this.departments = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot load active departments');
      } finally {
        this.loading = false;
      }
    },
    async getDepartmentById(id: number): Promise<Department | null> {
      try {
        this.loading = true;
        const response = await departmentsApi.getById(id);
        this.department = response.data;
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load departments by id');
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteDepartment(id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await departmentsApi.delete(id);
        await this.getDepartmentById(id);
        this.incrementVersion();
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot restore departments');
      } finally {
        this.loading = false;
      }
    },
    async restoreDepartment(id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await departmentsApi.restore(id);
        await this.getDepartmentById(id);
        this.incrementVersion();
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot restore departments');
      } finally {
        this.loading = false;
      }
    },
    async updateDepartment(id: number, body: DepartmentForm): Promise<void> {
      try {
        this.loading = true;
        const response = await departmentsApi.update(id, body);
        this.department = response.data;
        this.incrementVersion();
        return response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot update departments');
      } finally {
        this.loading = false;
      }
    },
    async createDepartment(body: DepartmentForm): Promise<void> {
      try {
        this.loading = true;
        const response = await departmentsApi.create(body);
        this.incrementVersion();
        this.department = response.data;
      } catch (error) {
        console.error(error);
        alert('Cannot create departments');
      } finally {
        this.loading = false;
      }
    },
    buildTree(list: Department[]): Department[] {
      const map = new Map<number, Department>();
      list.forEach((item) => map.set(item.id, { ...item, children: [] }));
      const roots: Department[] = [];
      map.forEach((dept) => {
        if (dept.parent_id === null) {
          roots.push(dept);
        } else {
          const parent = map.get(dept.parent_id);
          if (parent) parent.children!.push(dept);
        }
      });
      return roots;
    },
  },
});
