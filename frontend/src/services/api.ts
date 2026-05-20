import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Error inesperado';
    if (error.response?.status < 500) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
