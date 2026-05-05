import { create } from 'zustand';

let id = 0;
const next = () => ++id;

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (toast) => {
    const t = { id: next(), variant: 'info', duration: 4000, ...toast };
    set({ toasts: [...get().toasts, t] });
    if (t.duration > 0) setTimeout(() => get().remove(t.id), t.duration);
  },
  remove: (tid) => set({ toasts: get().toasts.filter((t) => t.id !== tid) }),
}));

export const toast = {
  success: (message, opts = {}) => useToastStore.getState().push({ variant: 'success', message, ...opts }),
  error:   (message, opts = {}) => useToastStore.getState().push({ variant: 'error', message, ...opts }),
  info:    (message, opts = {}) => useToastStore.getState().push({ variant: 'info', message, ...opts }),
  loading: (message, opts = {}) => useToastStore.getState().push({ variant: 'loading', message, duration: 0, ...opts }),
  dismiss: (id) => useToastStore.getState().remove(id),
};
