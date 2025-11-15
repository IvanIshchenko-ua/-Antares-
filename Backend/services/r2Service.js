const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Конфігурація Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const r2Service = {
  // Завантажити файл в R2
  uploadFile: async (fileBuffer, fileName, mimeType) => {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await s3Client.send(command);
      
      // Повертаємо публічний URL файлу
      return `${process.env.R2_PUBLIC_URL}/${fileName}`;
    } catch (error) {
      console.error('❌ R2 Upload Error:', error);
      throw error;
    }
  },

  // Видалити файл з R2
  deleteFile: async (fileName) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
      });

      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error('❌ R2 Delete Error:', error);
      throw error;
    }
  },

  // Отримати список файлів
  listFiles: async () => {
    try {
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
      });

      const response = await s3Client.send(command);
      return response.Contents || [];
    } catch (error) {
      console.error('❌ R2 List Error:', error);
      throw error;
    }
  },

  // Генерувати унікальне ім'я файлу
  generateFileName: (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `gallery/${timestamp}-${randomString}.${extension}`;
  }
};

module.exports = r2Service;