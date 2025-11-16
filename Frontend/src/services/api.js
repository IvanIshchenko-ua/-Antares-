import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // або 'http://192.168.0.224:5000/api'
  timeout: 10000,
});

// Додайте перехоплювач для відладки
api.interceptors.request.use(request => {
  //console.log('🔄 Axios Request:', request.method?.toUpperCase(), request.url);
  //console.log('📦 Request Data:', request.data);
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