import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
      refetchInterval: 1000 * 60, // Auto-refetch every 1 minute
    },
    mutations: {
      retry: 1,
    },
  },
});
