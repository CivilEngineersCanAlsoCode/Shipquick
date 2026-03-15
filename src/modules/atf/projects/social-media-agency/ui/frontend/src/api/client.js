import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-key-change-me';

class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText, code: 'UNKNOWN' }));
    throw new ApiError(error.error, error.code, res.status);
  }
  return res.json();
}

// --- Query hooks ---

export function usePipeline() {
  return useQuery({
    queryKey: ['pipeline'],
    queryFn: () => apiFetch('/pipeline'),
    refetchInterval: 60_000,
  });
}

export function usePosts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.pillar) params.set('pillar', filters.pillar);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.q) params.set('q', filters.q);
  const qs = params.toString();
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => apiFetch(`/posts${qs ? `?${qs}` : ''}`),
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => apiFetch(`/posts/${id}`),
    enabled: !!id,
  });
}

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: () => apiFetch('/config'),
  });
}

export function useAnalytics(period = '7d') {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => apiFetch(`/analytics?period=${period}`),
  });
}

// --- Mutation hooks ---

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiFetch(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: ['posts', id] });
      qc.invalidateQueries({ queryKey: ['pipeline'] });
    },
  });
}

export function usePublishPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiFetch(`/publish/${id}`, { method: 'POST' }),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: ['posts', id] });
      qc.invalidateQueries({ queryKey: ['pipeline'] });
    },
  });
}

export function useSaveConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiFetch('/config', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['config'] });
    },
  });
}
