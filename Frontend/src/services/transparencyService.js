import api from './api';

export const transparencyService = {
  // Отримати всі розділи
  getAll: async () => {
    try {
      const response = await api.get('/transparency');
      return response.data;
    } catch (error) {
      console.error('❌ Помилка завантаження розділів прозорості:', error);
      // Повертаємо пустий масив у разі помилки
      return [];
    }
  },

  // Отримати конкретний розділ
  getByType: async (sectionType) => {
    try {
      const response = await api.get(`/transparency/${sectionType}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Помилка завантаження розділу ${sectionType}:`, error);
      throw error;
    }
  },

  // Оновити розділ
  update: async (sectionType, data) => {
    try {
      const response = await api.put(`/transparency/${sectionType}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Помилка оновлення розділу ${sectionType}:`, error);
      throw error;
    }
  },
  uploadDocument: async (formData) => {
  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // { success, url, filename }
  } catch (error) {
    console.error('❌ Помилка завантаження документа в R2:', error);
    throw error;
  }
},
};