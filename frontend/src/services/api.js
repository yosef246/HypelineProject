import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({ baseURL: baseURL + '/api', withCredentials: true });

// Attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh on 401
let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry && !original.url.includes('/auth/')) {
      original._retry = true;
      try {
        refreshing = refreshing || axios.post(baseURL + '/api/auth/refresh', {}, { withCredentials: true });
        const r = await refreshing;
        refreshing = null;
        const token = r.data.data.accessToken;
        useAuthStore.getState().setAccessToken(token);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        useAuthStore.getState().clear();
      }
    }
    throw err;
  }
);

// Handy parse — backend returns { ok, data, message, error }
export const unwrap = (resPromise) => resPromise.then((r) => r.data?.data ?? r.data);
export const errorMessage = (err) =>
  err?.response?.data?.error || err?.response?.data?.message || err?.message || 'אירעה שגיאה לא צפויה';
