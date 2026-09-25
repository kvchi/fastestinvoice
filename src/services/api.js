import axios from 'axios';

// Reserved for the future server-backed document repository. The current app
// intentionally uses localStorage and does not simulate successful API calls.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const backendStatus = Object.freeze({
  connected: false,
  message: 'Backend persistence is not connected yet.',
});

export default api;
