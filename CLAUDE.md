# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A restaurant management application built with React + TypeScript + Vite. The app handles two main workflows: **Orders** (takeout/delivery) and **Reservations** (dine-in). Currently uses mock data and mock authentication.

## Commands

### Development
```bash
npm run dev          # Start development server (Vite + HMR)
npm run build        # Type-check with tsc and build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Backend API
The app expects a backend API at `http://localhost:8081` (see `src/api/axiosInstance.ts:6`). Currently uses mock data when backend is unavailable.

## Architecture

### State Management Pattern

**Three-layer state architecture:**

1. **Zustand Stores** (`src/store/`) - Client-side application state
   - `auth.store.ts` - Authentication state and login/logout actions
   - `order.store.ts` - Order management UI state
   - `reservation.store.ts` - Reservation management UI state
   - All stores use `devtools` middleware for debugging

2. **TanStack Query** (`src/hooks/queries/`) - Server state and caching
   - `useOrderQueries.ts` - Order data fetching and mutations
   - `useReservationQueries.ts` - Reservation data fetching and mutations
   - Query keys are defined using factory pattern (e.g., `orderKeys.byDate(date)`)
   - Optimistic updates are used for mutations (complete, delete operations)
   - Auto-refetch configured at 1-minute intervals (see `src/lib/queryClient.ts:9`)

3. **Component State** - Local UI state (React hooks)

**When to use which:**
- Zustand: UI state that persists across components (auth, filters, selections)
- TanStack Query: Server data, caching, and synchronization
- Component state: Ephemeral UI state (modal open/close, form inputs)

### Authentication Flow

1. **Token Storage**: JWT tokens stored in cookies (3-day expiration)
   - Managed by `tokenManager` in `src/api/axiosInstance.ts:72-89`
   - Cookie utilities in `src/utils/cookieManager.ts`

2. **Session Restoration**: On app load, `App.tsx:20-42` checks for token and restores auth state
   - Auto-logout timer set for 1 minute before token expiration (`App.tsx:48-81`)

3. **Protected Routes**: `ProtectedRoute` component (`src/components/routes/ProtectedRoute.tsx`) wraps authenticated pages

4. **Request Interceptor**: Axios interceptor adds `Authorization: Bearer <token>` header (`src/api/axiosInstance.ts:19-30`)

### API Response Handling

The backend uses a custom response format:
```typescript
{
  status: 'Success' | 'Error',
  msg: string,
  data: T | string  // May be JSON string or object
}
```

**Response interceptor** (`src/api/axiosInstance.ts:33-69`) handles:
- Converting non-success status to errors
- Parsing JSON string data into objects
- Normalizing error format to `ApiError` type

### Form Validation

Uses **React Hook Form** + **Zod** for type-safe validation:
- Schemas defined in `src/schemas/` (currently only `auth.schema.ts`)
- `@hookform/resolvers/zod` integrates Zod with React Hook Form
- Form inputs use `FormInput` component (`src/components/common/FormInput.tsx`)

### Routing

React Router v7 configured in `src/router/index.tsx`:
- `/login` - Login page
- `/register` - Registration page
- `/order` - Order management (protected)
- `/reservation` - Reservation management (protected)
- `/` redirects to `/login`

Protected routes require authentication via `ProtectedRoute` wrapper.

### Type System

**Key type locations:**
- `src/types/index.ts` - Main domain types (`OrderItem`, `ReservationItem`)
- `src/types/auth.ts` - Auth-related types (`LoginRequest`, `ApiResponse`, `ApiError`)
- Form data types are inferred from Zod schemas using `z.infer<>`

## Mock Data vs Real API

The app is designed to work with both mock data and a real backend:

**Mock Mode** (current):
- `src/data/mockData.ts` - Sample orders and reservations
- `src/data/mockAuth.ts` - Mock login API
- In-memory stores in query hooks simulate server state

**Real API Mode**:
- Update `API_BASE_URL` in `src/api/axiosInstance.ts:6`
- Replace mock query functions with real API calls from `src/api/*.api.ts`
- Auth flow already configured for real JWT tokens

## Key Patterns

### Optimistic Updates
Mutations in query hooks use optimistic updates for better UX:
1. Cancel in-flight queries
2. Immediately update cached data
3. Show success toast
4. On error, invalidate cache to refetch real data

See `useCompleteOrder` in `src/hooks/queries/useOrderQueries.ts:38-78` for example.

### Toast Notifications
Centralized toast utilities in `src/utils/toast.ts`:
- `showSuccessToast()`, `showErrorToast()`, `showLoadingToast()`
- `updateToastSuccess()`, `updateToastError()` for updating loading toasts
- React Hot Toast configured in `App.tsx:86-109`

### Date Filtering
Orders and reservations are filtered by date:
- Query keys include date for proper cache separation
- TanStack Query automatically manages cache per date

## Important Notes

- **Strict TypeScript**: Project uses strict mode with additional linting rules
- **SWC for Fast Refresh**: Uses `@vitejs/plugin-react-swc` instead of Babel
- **Cookie-based Auth**: Tokens stored in cookies, not localStorage
- **Auto-refetch**: Query client refetches data every 1 minute by default
