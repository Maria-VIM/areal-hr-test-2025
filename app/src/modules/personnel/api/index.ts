import { api } from '@/shared/api';

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
  update(id: number, body: any) {
    return api.patch(`/personnel-operation/id/${id}`, body);
  },
  create(body: any) {
    return api.post(`/personnel-operation`, body);
  },
};
