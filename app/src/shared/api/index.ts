import apiClient from './apiClient';

export const api = {
  get(url: string, params?: Record<string, any>) {
    return apiClient.get(url, { params });
  },
  post(url: string, data: any) {
    return apiClient.post(url, data);
  },
  patch(url: string, data: any) {
    return apiClient.patch(url, data);
  },
  delete(url: string) {
    return apiClient.delete(url);
  },
};
