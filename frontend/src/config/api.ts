// API Configuration
export const API_CONFIG = {
  // Use environment variable or default to relative path for same-origin requests
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // API endpoints
  API: {
    USERS: '/api/users',
    LEAGUES: '/api/leagues',
    SURVIVOR: '/api/survivor',
    PLAYERS: '/api/players',
  }
};

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  // If no base URL is provided, use relative path for same-origin requests
  return API_CONFIG.BASE_URL ? `${API_CONFIG.BASE_URL}${endpoint}` : endpoint;
}

// Helper function to build auth URLs
export function buildAuthUrl(endpoint: string): string {
  // If no base URL is provided, use relative path for same-origin requests
  return API_CONFIG.BASE_URL ? `${API_CONFIG.BASE_URL}${endpoint}` : endpoint;
} 