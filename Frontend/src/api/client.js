// src/api/client.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getToken = () => localStorage.getItem('globetrotter_token');
export const setToken = (token) => localStorage.setItem('globetrotter_token', token);
export const removeToken = () => localStorage.removeItem('globetrotter_token');

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      let errorMessage = 'An error occurred. Please try again.';
      let errorCode = 'UNKNOWN_ERROR';

      if (data?.error) {
        if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data.error.message) {
          if (Array.isArray(data.error.message)) {
            errorMessage = data.error.message.map((e) => e.message || e.path?.join('.')).join(', ');
          } else {
            errorMessage = data.error.message;
          }
        }
        if (data.error.code) errorCode = data.error.code;
      }

      const error = new Error(errorMessage);
      error.code = errorCode;
      error.status = res.status;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    // Network or connection errors
    const netErr = new Error('Cannot connect to GlobeTrotter backend server. Please make sure backend is running on port 3000.');
    netErr.code = 'NETWORK_ERROR';
    throw netErr;
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  del: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
