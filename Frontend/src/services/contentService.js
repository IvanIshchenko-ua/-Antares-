import api from './api';

export const contentService = {
  getContent: async (pageName) => {
    try {
      console.log('Fetching content for:', pageName);
      const response = await api.get(`/content/${pageName}`);
      console.log('Content response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  },

  updateContent: async (pageName, content) => {
    try {
      console.log('Updating content for:', pageName);
      const response = await api.put(`/content/${pageName}`, { content });
      console.log('Update response:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  getPages: async () => {
    try {
      const response = await api.get('/content/pages');
      return response;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  },
  getGalleryImages: async () => {
    try {
      const response = await api.get('/api/gallery/images');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadGalleryImage: async (imageData) => {
    try {
      const response = await api.post('/api/gallery/images', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteGalleryImage: async (imageId) => {
    try {
      const response = await api.delete(`/api/gallery/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};