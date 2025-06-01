import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (
    token &&
    !config.url.includes('/login') &&
    !config.url.includes('/signup') &&
    !config.url.includes('/refresh-token')
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/login') || originalRequest.url.includes('/signup')) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/refresh-token');
        const newAccessToken = res.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
