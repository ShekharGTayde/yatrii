const rawBaseUrl = (import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api/v1').trim();
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');

export const API_BASE_URL = /\/api\/v1$/i.test(normalizedBaseUrl)
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/v1`;

export const buildApiUrl = (path = '') => {
  const normalizedPath = String(path).replace(/^\/+/, '');
  return `${API_BASE_URL}/${normalizedPath}`;
};

const rawSocketUrl = (import.meta.env.VITE_SOCKET_URL || '').trim();

export const SOCKET_SERVER_URL = rawSocketUrl
  ? rawSocketUrl.replace(/\/+$/, '')
  : API_BASE_URL.replace(/\/api\/v1$/i, '');
