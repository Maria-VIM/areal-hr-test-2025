import { api } from '@/shared/api';
import type { EmployeeForm } from '@/modules/employee/types/EmployeeForm.ts';

export const employeeApi = {
  getAll(params: {
    page?: number;
    pageSize?: number;
    organization_id?: number;
    department_id?: number;
    name?: string;
    is_deleted?: boolean;
  }) {
    return api.get('/employee', { params });
  },
  getTrainees(params: { page?: number; pageSize?: number; name?: string }) {
    return api.get('/employee/trainees', { params });
  },
  getAllActive() {
    return api.get('/employee/active');
  },

  getById(id: number) {
    return api.get(`/employee/id/${id}`);
  },
  delete(id: number) {
    return api.delete(`/employee/${id}`);
  },
  create(body: EmployeeForm) {
    return api.post(`/employee`, body);
  },
  update(id: number, body: EmployeeForm) {
    return api.patch(`/employee/${id}`, body);
  },
};
