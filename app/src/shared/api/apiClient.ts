import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default apiClient;
