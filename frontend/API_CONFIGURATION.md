# API Configuration

This document explains how to configure the API endpoints for the frontend.

## Environment Variables

The frontend uses environment variables to configure API endpoints. Create a `.env` file in the `frontend` directory with the following variables:

### `VITE_API_BASE_URL`
The base URL for the backend API. 

**Examples:**
- `VITE_API_BASE_URL=http://localhost:8000` - For local development
- `VITE_API_BASE_URL=https://api.yourdomain.com` - For production
- `VITE_API_BASE_URL=` (empty) - For same-origin requests (when frontend and backend are served from the same domain)

## Configuration Files

### `src/config/api.ts`
Centralized API configuration that:
- Reads environment variables
- Provides helper functions to build API URLs
- Defines endpoint constants

### Usage Examples

```typescript
import { buildApiUrl, buildAuthUrl } from '../config/api';

// For API endpoints
const usersUrl = buildApiUrl('/api/users');
const leaguesUrl = buildApiUrl('/api/leagues');

// For auth endpoints  
const loginUrl = buildAuthUrl('/auth/login');
const registerUrl = buildAuthUrl('/auth/register');
```

## Development vs Production

### Development
```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
```

### Production (Same Domain)
```bash
# .env
VITE_API_BASE_URL=
```

### Production (Different Domain)
```bash
# .env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## CORS Configuration

When using different domains, ensure your backend CORS configuration includes your frontend domain:

```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "http://localhost:3000",  # Vite dev server
    "http://localhost:5173",  # Vite dev server (alternative port)
    "https://yourdomain.com", # Production frontend
]
``` 