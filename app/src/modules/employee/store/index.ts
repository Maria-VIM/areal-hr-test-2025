import { defineStore } from 'pinia';
import { employeeApi } from '@/modules/employee/api/intex.ts';
import type { Employee } from '@/modules/employee/types/Employee.ts';
import type { EmployeeForm } from '@/modules/employee/types/EmployeeForm.ts';

export const useEmployeesStore = defineStore('employee', {
  state: () => ({
    loading: true,
    employees: [] as Employee[],
    employee: null as Employee | null,
    version: 0,
  }),
  actions: {
    incrementVersion() {
      this.version++;
    },
    async fetchEmployeesByOrganization(organization_id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getAllByOrganization(organization_id);
        this.employees = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load employees by organization');
      } finally {
        this.loading = false;
      }
    },
    async fetchEmployeeByDepartment(department_id: number): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getAllByDepartment(department_id);
        this.employees = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load employees by department');
      } finally {
        this.loading = false;
      }
    },
    async fetchTrainees(): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getTrainees();
        this.employees = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load trainees');
      } finally {
        this.loading = false;
      }
    },
    async fetchEmployeeByName(name: string): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getAllByName(name);
        this.employees = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load employees by department');
      } finally {
        this.loading = false;
      }
    },
    async fetchDeletedEmployee(): Promise<void> {
      try {
        this.loading = true;
        const response = await employeeApi.getDeleted();
        this.employees = response.data.sort((a: any, b: any) => a.id - b.id);
        return response.data;
      } catch (error) {
        console.log(error);
        alert('Cannot load deleted employees');
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
