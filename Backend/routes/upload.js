const express = require('express');
const multer = require('multer');
const r2Service = require('../services/r2Service');
const router = express.Router();

// Використовуємо memory storage для multer
const storage = multer.memoryStorage();

// Фільтр файлів: дозволяємо зображення та документи
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error('❌ Заборонений тип файлу:', file.mimetype);
    cb(new Error('Only image and document files are allowed!'), false);
  }
};

// Налаштування multer
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter
});

// === Завантаження файлу в R2 ===
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('❌ Немає файлу в запиті!');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📤 Uploading to R2:', req.file.originalname, req.file.mimetype);

    // Визначаємо папку за категорією
    const category = req.body.category || 'general';
    let folder = 'general';

    // Якщо документ для прозорості — кладемо у підпапку transparency
    if (category === 'transparency') {
      folder = 'transparency';
    }

    // Генеруємо унікальне ім'я файлу
    const extension = req.file.originalname.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${timestamp}-${random}.${extension}`;

    // Завантажуємо в R2
    const fileUrl = await r2Service.uploadFile(
      req.file.buffer,
      fileName,
      req.file.mimetype
    );

    console.log('✅ File uploaded to R2:', fileUrl);

    res.json({
      success: true,
      url: fileUrl,
      filename: fileName,
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('❌ R2 Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
});

// === Видалення файлу з R2 ===
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    await r2Service.deleteFile(filename);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('❌ R2 Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      details: error.message
    });
  }
});

// === Отримання списку файлів ===
router.get('/', async (req, res) => {
  try {
    const files = await r2Service.listFiles();
    const fileList = files.map(file => ({
      url: `${process.env.R2_PUBLIC_URL}/${file.Key}`,
      filename: file.Key,
      size: file.Size,
      lastModified: file.LastModified
    }));

    res.json(fileList);
  } catch (error) {
    console.error('❌ R2 List error:', error);
    res.status(500).json({
      error: 'Error getting files',
      details: error.message
    });
  }
});

module.exports = router;
