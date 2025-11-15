const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.224:3000'],
  credentials: true
}));

app.use(express.json());

// Підключення до MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'admin_panel_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ Помилка підключення до MySQL:', err);
    return;
  }
  console.log('✅ Підключено до MySQL');
  
  // Створення таблиці новин
  const createTable = `
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      shortDescription TEXT NOT NULL,
      fullContent TEXT NOT NULL,
      image VARCHAR(500),
      author VARCHAR(100) DEFAULT 'Адміністрація',
      isPublished BOOLEAN DEFAULT TRUE,
      views INT DEFAULT 0,
      publishDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTable, (err) => {
    if (err) {
      console.error('❌ Помилка створення таблиці:', err);
    } else {
      console.log('✅ Таблиця news готова');
    }
  });
});

// Логування
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Маршрут для GET /api/news
app.get('/api/news', (req, res) => {
  console.log('✅ Обробляємо GET /api/news');
  
  db.query('SELECT * FROM news WHERE isPublished = true ORDER BY publishDate DESC', (err, results) => {
    if (err) {
      console.error('❌ Помилка бази даних:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    console.log(`✅ Знайдено ${results.length} новин`);
    res.json(results);
  });
});

// Маршрут для POST /api/news
app.post('/api/news', (req, res) => {
  console.log('✅ Обробляємо POST /api/news');
  console.log('📦 Дані:', req.body);
  
  const { title, shortDescription, fullContent, image, author } = req.body;
  
  if (!title || !shortDescription || !fullContent) {
    return res.status(400).json({ error: 'Відсутні обов\'язкові поля' });
  }
  
  const query = `
    INSERT INTO news (title, shortDescription, fullContent, image, author) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [title, shortDescription, fullContent, image, author || 'Адміністрація'], (err, results) => {
    if (err) {
      console.error('❌ Помилка створення новини:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    const newNews = {
      id: results.insertId,
      title,
      shortDescription,
      fullContent,
      image,
      author: author || 'Адміністрація',
      isPublished: true,
      views: 0,
      publishDate: new Date().toISOString()
    };
    
    console.log('✅ Новину створено з ID:', results.insertId);
    res.status(201).json(newNews);
  });
});

// Тестовий маршрут
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Сервер працює!',
    timestamp: new Date().toISOString()
  });
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 СЕРВЕР НОВИН ЗАПУЩЕНО');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('=================================');
  console.log('Доступні маршрути:');
  console.log('  GET  /api/test');
  console.log('  GET  /api/news');
  console.log('  POST /api/news');
  console.log('=================================');
});