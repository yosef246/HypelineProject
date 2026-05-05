import { create } from 'zustand';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  hydrated: false,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),

  hydrate: async () => {
    try {
      const r = await axios.post(baseURL + '/api/auth/refresh', {}, { withCredentials: true });
      const token = r.data?.data?.accessToken;
      if (token) {
        set({ accessToken: token });
        const me = await axios.get(baseURL + '/api/me', {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
        });
        set({ user: me.data?.data?.user });
      }
    } catch {
      /* not logged in */
    } finally {
      set({ hydrated: true });
    }
  },

  loginSuccess: ({ user, accessToken }) => set({ user, accessToken }),

  logout: async () => {
    try {
      const token = get().accessToken;
      if (token) {
        await axios.post(baseURL + '/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true,
        });
      }
    } catch { /* noop */ }
    set({ user: null, accessToken: null });
  },

  clear: () => set({ user: null, accessToken: null }),
}));
