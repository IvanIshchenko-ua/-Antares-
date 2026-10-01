import api from './api';

const signupService = {
  send: (payload) => api.post('/signup', payload),
};

export default signupService;