import api from './api';

const newsService = {
  // Отримати всі новини
  getAllNews: () => {
    console.log('Making GET /news request');
    return api.get('/news');
  },
  getAllAdminNews: () => api.get('/news/admin'),
  
  // Отримати одну новину по ID
  getNewsById: (id) => {
    console.log(`Making GET /news/${id} request`);
    return api.get(`/news/${id}`);
  },
  
  // Створити новину
  createNews: (newsData) => {
    return api.post('/news', newsData);
  },
  
  // Оновити новину
  updateNews: (id, newsData) => {
    return api.put(`/news/${id}`, newsData);
  },
  
  // Видалити новину
  deleteNews: (id) => {
    console.log(`Making DELETE /news/${id} request`);
    return api.delete(`/news/${id}`);
  }
};

export { newsService };