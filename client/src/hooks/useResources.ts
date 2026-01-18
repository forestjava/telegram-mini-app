import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { Resource, BookingResponse, CreateBookingDto } from '@/types/booking';

const RESOURCES_QUERY_KEY = ['bookings', 'resources'];

/**
 * Hook to fetch resources tree with bookings
 */
export function useResources() {
  return useQuery({
    queryKey: RESOURCES_QUERY_KEY,
    queryFn: () => api.get<Resource[]>('/api/bookings/resources'),
  });
}

/**
 * Hook to create a booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingDto) =>
      api.post<BookingResponse>('/api/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a booking
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: number) =>
      api.delete<BookingResponse>(`/api/bookings/${resourceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY });
    },
  });
}
