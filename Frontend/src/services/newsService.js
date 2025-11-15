import api from './api';

const newsService = {
  // Отримати всі новини
  getAllNews: () => {
    console.log('Making GET /news request');
    return api.get('/news');
  },
  
  // Отримати одну новину по ID
  getNewsById: (id) => {
    console.log(`Making GET /news/${id} request`);
    return api.get(`/news/${id}`);
  },
  
  // Створити новину
  createNews: (newsData) => {
    console.log('Making POST /news request with data:', newsData);
    return api.post('/news', newsData);
  },
  
  // Оновити новину
  updateNews: (id, newsData) => {
    console.log(`Making PUT /news/${id} request with data:`, newsData);
    return api.put(`/news/${id}`, newsData);
  },
  
  // Видалити новину
  deleteNews: (id) => {
    console.log(`Making DELETE /news/${id} request`);
    return api.delete(`/news/${id}`);
  }
};

export { newsService };