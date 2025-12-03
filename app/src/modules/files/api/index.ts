import { api } from '@/shared/api';

export const fileApi = {
  getAllFiles(employee_id: number) {
    return api.get(`/file/employee_id/${employee_id}`);
  },
  downloadFile(id: number) {
    return api.get(`/file/download/${id}`, { responseType: 'blob' });
  },
  delete(id: number) {
    return api.delete(`/file/${id}`);
  },
  uploadFile(formData: FormData) {
    return api.post('/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
