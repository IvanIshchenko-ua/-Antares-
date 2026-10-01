import axios from 'axios';

const DEFAULT_API = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: DEFAULT_API,
  timeout: 10000,
});

// Додайте перехоплювач для відладки
api.interceptors.request.use(request => {
  const token = localStorage.getItem('authToken');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

api.interceptors.response.use(
  response => {
    //console.log('✅ Axios Response:', response.status, response.data);
    return response;
  },
  error => {
    //console.log('❌ Axios Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;