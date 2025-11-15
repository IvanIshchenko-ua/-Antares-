const express = require('express');
const app = express();

// ДУЖЕ важливо: обробляємо JSON
app.use(express.json());

// Логування всіх запитів
app.use((req, res, next) => {
  console.log('=== POSTMAN TEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  console.log('====================');
  next();
});

// Маршрут для POST /api/news
app.post('/api/news', (req, res) => {
  console.log('✅ POST /api/news отримано!');
  console.log('📦 Дані:', req.body);
  
  res.status(201).json({
    id: Date.now(),
    ...req.body,
    message: '✅ Успішно з Postman!',
    timestamp: new Date().toISOString()
  });
});

// Маршрут для GET /api/news (для перевірки)
app.get('/api/news', (req, res) => {
  res.json([{ id: 1, title: 'Тест', description: 'GET працює' }]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log('🔬 POSTMAN TEST SERVER');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('📮 Тестуйте POST /api/news в Postman');
});