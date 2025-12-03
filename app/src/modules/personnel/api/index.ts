import { api } from '@/shared/api';
import type { PersonnelOperationForm } from '@/modules/personnel/types/PersonnelForm.ts';

export const PersonnelApi = {
  getAllByEmployeeId(employee_id: number) {
    return api.get(`/personnel-operation/employee_id/${employee_id}`);
  },
  getById(id: number) {
    return api.get(`/personnel-operation/id/${id}`);
  },
  delete(id: number) {
    return api.delete(`/personnel-operation/${id}`);
  },
  update(id: number, body: PersonnelOperationForm) {
    return api.patch(`/personnel-operation/${id}`, body);
  },
  create(body: PersonnelOperationForm) {
    return api.post(`/personnel-operation`, body);
  },
};
