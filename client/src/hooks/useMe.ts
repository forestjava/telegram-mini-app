import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

interface MeResponse {
  [key: string]: unknown;
}

export function useMe(enabled: boolean = false) {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<MeResponse>('/api/me'),
    enabled,
  });
}
