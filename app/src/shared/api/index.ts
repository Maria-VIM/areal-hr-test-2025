import apiClient from './apiClient';

export const api = {
  get(url: string, config?: any) {
    return apiClient.get(url, config);
  },
  post(url: string, data: any, config?: any) {
    return apiClient.post(url, data, config);
  },
  patch(url: string, data: any) {
    return apiClient.patch(url, data);
  },
  delete(url: string) {
    return apiClient.delete(url);
  },
};
