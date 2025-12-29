/**
 * Mock Authentication API
 * Simulates real API behavior with tokens and delays
 * Use credentials: username: "user1", password: "123456"
 */

interface MockLoginRequest {
  username: string;
  password: string;
}

interface MockLoginResponse {
  token: string;
}

// Mock valid credentials
const VALID_CREDENTIALS = {
  username: 'user1',
  password: '123456',
};

// Mock token (similar to real JWT structure from API)
const generateMockToken = (username: string): string => {
  const header = 'eyJhbGciOiJIUzUxMjJ9'; // {"alg":"HS512"}

  const payloadObj = {
    sub: username,
    mat: Math.floor(Date.now() / 1000),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    role: 'USER',
    id: Math.floor(Math.random() * 1000),
  };

  // Use btoa for browser-compatible base64 encoding
  const payload = btoa(JSON.stringify(payloadObj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const signature = 'CsRdEC1AIVKAJPh0DQL_qkauFMKSN1Ei9H944GJHDIIwg';

  return `${header}.${payload}.${signature}`;
};

/**
 * Mock login function - simulates API call
 * Delay 500ms to simulate network request
 */
export const mockLoginApi = {
  login: async (credentials: MockLoginRequest): Promise<MockLoginResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate credentials
    if (
      credentials.username !== VALID_CREDENTIALS.username ||
      credentials.password !== VALID_CREDENTIALS.password
    ) {
      throw new Error('Invalid username or password');
    }

    // Return mock token
    const token = generateMockToken(credentials.username);
    return { token };
  },
};
