import api from './api';

const galleryService = {
  // Отримати всі фото галереї
  getGalleryImages: async () => {
    try {
      console.log('🔧 Making GET request to /gallery');
      const response = await api.get('/gallery');
      console.log('🔧 GET /gallery response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Помилка отримання фото:', error);
      return { images: [] };
    }
  },

  // Завантажити нове фото в R2
  uploadGalleryImage: async (formData) => {
    try {
      console.log('🔧 Starting R2 upload process...');
      
      // 1. Завантажуємо файл в R2
      console.log('🔧 Step 1: Uploading file to R2');
      const uploadResponse = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('🔧 R2 upload response:', uploadResponse.data);

      if (!uploadResponse.data.success) {
        throw new Error('R2 upload failed');
      }

      // 2. Створюємо запис в галереї
      console.log('🔧 Step 2: Creating gallery record');
      const imageData = {
        title: formData.get('title'),
        description: formData.get('description'),
        image_url: uploadResponse.data.url,
        category: formData.get('category'),
        filename: uploadResponse.data.filename // Зберігаємо ім'я файлу для можливого видалення
      };

      console.log('🔧 Gallery data to send:', imageData);
      
      const galleryResponse = await api.post('/gallery', imageData);
      console.log('🔧 Gallery creation response:', galleryResponse.data);
      
      return galleryResponse.data;
    } catch (error) {
      console.error('❌ Помилка завантаження в R2:', error);
      throw error;
    }
  },

  // Створити фото через посилання
  createGalleryImage: async (imageData) => {
    try {
      console.log('🔧 Creating gallery image from URL:', imageData);
      const response = await api.post('/gallery', imageData);
      console.log('🔧 Gallery creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Помилка створення фото з посилання:', error);
      throw error;
    }
  },

  // Видалити фото (з R2 та з бази)
  deleteGalleryImage: async (imageId, filename = null) => {
    try {
      // Спочатку видаляємо з бази
      const response = await api.delete(`/gallery/${imageId}`);
      
      // Якщо є filename, видаляємо файл з R2
      if (filename) {
        try {
          await api.delete(`/upload/${filename}`);
          console.log('✅ File deleted from R2:', filename);
        } catch (r2Error) {
          console.error('❌ Error deleting from R2:', r2Error);
          // Продовжуємо, навіть якщо не вдалося видалити з R2
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Помилка видалення фото:', error);
      throw error;
    }
  }
};

export default galleryService;