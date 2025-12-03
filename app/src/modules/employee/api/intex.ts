import { api } from '@/shared/api';
import type { EmployeeForm } from '@/modules/employee/types/EmployeeForm.ts';

export const employeeApi = {
  getAllByOrganization(organization_id: number) {
    return api.get(`/employee/organization/${organization_id}`);
  },
  getAllByDepartment(department_id: number) {
    return api.get(`/employee/department/${department_id}`);
  },
  getDeleted() {
    return api.get(`/employee/deleted`);
  },
  getTrainees() {
    return api.get(`/employee/trainees`);
  },
  getAllByName(name: string) {
    return api.get(`/employee/name/${name}`);
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
