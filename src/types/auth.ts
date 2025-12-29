export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface RegisterResponse {
  token: string;
}

export interface ApiResponse<T> {
  status: 'Success' | 'Failed';
  msg: string;
  data: T;
}

