export const ENV = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  tokenExpiryDays: Number(import.meta.env.VITE_TOKEN_EXPIRY_DAYS) || 3,
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  queryRefetchInterval: Number(import.meta.env.VITE_QUERY_REFETCH_INTERVAL) || 60000
} as const;
