import { QueryClient } from '@tanstack/react-query';
import { ENV } from '../config/env';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: ENV.queryRefetchInterval,
      refetchInterval: ENV.queryRefetchInterval,
    },
    mutations: {
      retry: 1,
    },
  },
});
