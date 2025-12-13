import { defineStore } from 'pinia';
import { employeeApi } from '@/modules/employee/api/intex.ts';
import type { Employee } from '@/modules/employee/types/Employee.ts';
import type { EmployeeForm } from '@/modules/employee/types/EmployeeForm.ts';

export const useEmployeesStore = defineStore('employee', {
  state: () => ({
    loading: true,
    employees: [] as Employee[],
    employee: null as Employee | null,
    totalEmployee: 0,
    totalPages: 0,
    version: 0,
  }),
  actions: {
    incrementVersion() {
      this.version++;
    },
    async fetchEmployees(params: {
      organization_id?: number;
      department_id?: number;
      name?: string;
      is_deleted?: boolean;
      page?: number;
      pageSize?: number;
    }): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getAll(params);
        this.employees = response.data.employees.sort((a: any, b: any) => a.id - b.id);
        this.totalPages = response.data.totalPages;
        this.totalEmployee = response.data.totalCount;
      } catch (error) {
        console.log(error);
        alert('Cannot load employees');
      } finally {
        this.loading = false;
      }
    },
    async fetchActive(): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getAllActive();
        this.employees = response.data.sort((a: any, b: any) => a.id - b.id);
      } catch (error) {
        console.log(error);
        alert('Cannot load active employees');
      } finally {
        this.loading = false;
      }
    },
    async fetchTrainees(params?: {
      name?: string;
      page?: number;
      pageSize?: number;
    }): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getTrainees(params || {});
        this.employees = response.data.employees.sort((a: any, b: any) => a.id - b.id);
        this.totalPages = response.data.totalPages;
        this.totalEmployee = response.data.totalCount;
      } catch (error) {
        console.log(error);
        alert('Cannot load trainees');
      } finally {
        this.loading = false;
      }
    },
    async getEmployeeById(id: number): Promise<Employee | null> {
      try {
        this.loading = true;
        const response = await employeeApi.getById(id);
        this.employee = response.data;
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load deleted employees');
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createEmployee(body: EmployeeForm): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.create(body);
        this.employee = response.data;
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot create employee');
      } finally {
        this.loading = false;
      }
    },
    async updateEmployee(id: number, body: EmployeeForm): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.update(id, body);
        this.employee = response.data;
        this.incrementVersion();
      } catch (error) {
        console.error(error);
        alert('Cannot update employee');
      } finally {
        this.loading = false;
      }
    },
    async deleteEmployee(id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.delete(id);
        this.employee = response.data;
        this.incrementVersion();
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot delete employee');
      } finally {
        this.loading = false;
      }
    },
  },
});
