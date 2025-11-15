const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const authController = require('./controllers/authController');


dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.0.224:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Логування всіх запитів
app.use((req, res, next) => {
  console.log('=== SERVER REQUEST ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Original URL:', req.originalUrl);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  console.log('======================');
  next();
});

// Статичні файли
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log("MYSQL_PASSWORD:", process.env.MYSQL_PASSWORD ? "Встановлено" : "Не встановлено");

// Підключення до бази даних
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'admin_panel_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Помилка підключення до MySQL:', err);
  } else {
    console.log('✅ Підключено до MySQL бази даних');
    
    // Створення таблиці для новин
    const createNewsTable = `
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        shortDescription TEXT NOT NULL,
        fullContent TEXT NOT NULL,
        image VARCHAR(500),
        author VARCHAR(100) DEFAULT 'Адміністрація',
        isPublished BOOLEAN DEFAULT TRUE,
        views INT DEFAULT 0,
        publishDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    db.query(createNewsTable, (err) => {
      if (err) {
        console.error('❌ Помилка створення таблиці news:', err);
      } else {
        console.log('✅ Таблиця news готова до роботи');
      }
    });
  }
});

const createGalleryTable = `
  CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

db.query(createGalleryTable, (err) => {
  if (err) {
    console.error('❌ Помилка створення таблиці gallery:', err);
  } else {
    console.log('✅ Таблиця gallery готова до роботи');
  }
});

// ===== ТАБЛИЦЯ ТА МАРШРУТИ ДЛЯ ПРОЗОРОСТІ =====

// Створення таблиці для прозорості
const createTransparencyTable = `
  CREATE TABLE IF NOT EXISTS transparency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_type ENUM('tuition', 'statute', 'attestation') NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    documents JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

db.query(createTransparencyTable, (err) => {
  if (err) {
    console.error('❌ Помилка створення таблиці transparency:', err);
  } else {
    console.log('✅ Таблиця transparency готова до роботи');
    
    // Додаємо початкові дані
    const initialSections = [
      { section_type: 'tuition', title: 'Плата за навчання' },
      { section_type: 'statute', title: 'Статут' },
      { section_type: 'attestation', title: 'Атестація педагогічних працівників' }
    ];
    
    initialSections.forEach(section => {
      const insertQuery = 'INSERT IGNORE INTO transparency (section_type, title, documents) VALUES (?, ?, ?)';
      // Вставляємо з коректним пустим масивом JSON
      db.query(insertQuery, [section.section_type, section.title, '[]'], (err) => {
        if (err) {
          console.error(`❌ Помилка додавання розділу ${section.section_type}:`, err);
        } else {
          console.log(`✅ Розділ ${section.section_type} додано/ігноровано`);
        }
      });
    });
  }
});

const safeJsonParse = (str, defaultValue = []) => {
  try {
    if (!str) return defaultValue;

    // Якщо вже масив/об’єкт (MySQL повернув без stringify)
    if (typeof str === 'object') {
      return Array.isArray(str) ? str : [str];
    }

    let trimmed = String(str).trim();

    // Якщо явно порожній JSON
    if (trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed === '[]') {
      return [];
    }

    // 🧠 Якщо це класичний випадок [object Object]
    if (trimmed.startsWith('[object')) {
      console.warn('⚠️ Отримано [object Object] — повертаємо defaultValue');
      return defaultValue;
    }

    // 🧩 Виправляємо старі некоректні записи типу { key: 'value' }
    if (trimmed.includes("':") || trimmed.includes('url:')) {
      trimmed = trimmed
        .replace(/'/g, '"')           // заміна одинарних лапок на подвійні
        .replace(/(\w+):/g, '"$1":')  // додаємо лапки навколо ключів
        .replace(/,]/g, ']')          // видаляємо зайві коми
        .replace(/,}/g, '}');         // прибираємо коми перед дужками
    }

    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('❌ safeJsonParse Error:', error.message, 'Рядок:', str);
    return defaultValue;
  }
};

const checkRoleColumn = "SHOW COLUMNS FROM users LIKE 'role'";

db.query(checkRoleColumn, (err, results) => {
  if (err) {
    console.error('❌ Помилка перевірки колонки role:', err);
    return;
  }
  
  // Якщо колонки role немає, додаємо її
  if (results.length === 0) {
    const addRoleColumn = `
      ALTER TABLE users 
      ADD COLUMN role ENUM('admin', 'user') DEFAULT 'admin'
    `;
    
    db.query(addRoleColumn, (err) => {
      if (err) {
        console.error('❌ Помилка додавання колонки role:', err);
      } else {
        console.log('✅ Колонка role додана');
        addTestUsers();
      }
    });
  } else {
    console.log('✅ Колонка role вже існує');
    addTestUsers();
  }
});

// Функція для додавання тестових користувачів
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

db.query(createUsersTable, (err) => {
  if (err) {
    console.error('❌ Помилка створення таблиці users:', err);
  } else {
    console.log('✅ Таблиця users готова до роботи');
    
    // Після створення таблиці перевіряємо колонку role
    checkRoleColumnAndAddUsers();
  }
});

function checkRoleColumnAndAddUsers() {
  const checkRoleColumn = "SHOW COLUMNS FROM users LIKE 'role'";

  db.query(checkRoleColumn, (err, results) => {
    if (err) {
      console.error('❌ Помилка перевірки колонки role:', err);
      return;
    }
    
    // Якщо колонки role немає, додаємо її
    if (results.length === 0) {
      const addRoleColumn = `
        ALTER TABLE users 
        ADD COLUMN role ENUM('admin', 'user') DEFAULT 'admin'
      `;
      
      db.query(addRoleColumn, (err) => {
        if (err) {
          console.error('❌ Помилка додавання колонки role:', err);
        } else {
          console.log('✅ Колонка role додана');
          addTestUsers();
        }
      });
    } else {
      console.log('✅ Колонка role вже існує');
      addTestUsers();
    }
  });
}

function addTestUsers() {
  // Видаляємо старого тестового користувача, якщо він існує
  const deleteOldUser = 'DELETE FROM users WHERE email = "test@example.com"';
  db.query(deleteOldUser, (err) => {
    if (err) {
      console.error('❌ Помилка видалення старого тестового користувача:', err);
    } else {
      console.log('✅ Старий тестовий користувач видалений');
    }

    // Додаємо нового тестового користувача з правильним паролем
    const testPassword = 'testpassword';
    const hashedTestPassword = bcrypt.hashSync(testPassword, 10);
    
    const insertTestUser = `
      INSERT INTO users (username, email, password, role) 
      VALUES ('Тестовий Користувач', 'test@example.com', ?, 'admin')
    `;
    
    db.query(insertTestUser, [hashedTestPassword], (err) => {
      if (err) {
        console.error('❌ Помилка створення тестового користувача:', err);
      } else {
        console.log('✅ Новий тестовий користувач створений (email: test@example.com, password: testpassword)');
        console.log('🔑 Хеш пароля в базі:', hashedTestPassword);
      }
    });

    // Додаємо тестового адміністратора
    const adminPassword = 'admin123';
    const hashedAdminPassword = bcrypt.hashSync(adminPassword, 10);
    
    const insertAdmin = `
      INSERT IGNORE INTO users (username, email, password, role) 
      VALUES ('Адміністратор', 'admin@antares.art', ?, 'admin')
    `;
    
    db.query(insertAdmin, [hashedAdminPassword], (err) => {
      if (err) {
        console.error('❌ Помилка створення тестового адміністратора:', err);
      } else {
        console.log('✅ Тестовий адміністратор готовий (email: admin@antares.art, password: admin123)');
      }
    });
  });
}

// ===== МАРШРУТИ ДЛЯ ПРОЗОРОСТІ =====

// Отримати всі розділи прозорості
app.get('/api/transparency', (req, res) => {
  console.log('✅ Обробляємо GET /api/transparency');
  
  const query = 'SELECT * FROM transparency WHERE is_active = true ORDER BY id';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Помилка бази даних:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    // Безпечний парсинг JSON документів
    const parsedResults = results.map(item => ({
      ...item,
      documents: safeJsonParse(item.documents, [])
    }));
    
    console.log(`✅ Знайдено ${parsedResults.length} розділів прозорості`);
    res.json(parsedResults);
  });
});

// Отримати конкретний розділ
app.get('/api/transparency/:section_type', (req, res) => {
  const { section_type } = req.params;
  console.log(`✅ Обробляємо GET /api/transparency/${section_type}`);
  
  const query = 'SELECT * FROM transparency WHERE section_type = ?';
  
  db.query(query, [section_type], (err, results) => {
    if (err) {
      console.error('❌ Помилка бази даних:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Розділ не знайдено' });
    }
    
    const result = {
      ...results[0],
      documents: safeJsonParse(results[0].documents, [])
    };
    
    res.json(result);
  });
});

// Оновити розділ прозорості
app.put('/api/transparency/:section_type', (req, res) => {
  const { section_type } = req.params;
  console.log(`✅ Обробляємо PUT /api/transparency/${section_type}`);

  const { title, content, documents } = req.body;

  const query = `
    UPDATE transparency 
    SET title = ?, content = ?, documents = ?
    WHERE section_type = ?
  `;

  // 🧠 Безпечне перетворення документів у JSON
  let documentsJson = '[]';
  try {
    if (documents) {
      if (typeof documents === 'string') {
        // якщо вже JSON-рядок
        documentsJson = documents;
      } else if (Array.isArray(documents)) {
        // якщо масив об’єктів
        documentsJson = JSON.stringify(documents);
      } else if (typeof documents === 'object') {
        // якщо один об’єкт
        documentsJson = JSON.stringify([documents]);
      }
    }
  } catch (error) {
    console.error('❌ Помилка перетворення документів у JSON:', error);
    documentsJson = '[]';
  }

  db.query(query, [title, content, documentsJson, section_type], (err, results) => {
    if (err) {
      console.error('❌ Помилка оновлення розділу:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }

    console.log(`✅ Розділ ${section_type} оновлено успішно`);
    res.json({
      message: 'Розділ оновлено успішно',
      section_type,
      affectedRows: results.affectedRows,
    });
  });
});
// ===== ПРЯМІ МАРШРУТИ ДЛЯ НОВИН =====

// Маршрут для GET /api/news
app.get('/api/news', (req, res) => {
  console.log('✅ Обробляємо GET /api/news');
  
  const query = 'SELECT * FROM news WHERE isPublished = true ORDER BY publishDate DESC';
  
  db.query(query, (err, results) => {
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
  console.log('📦 Отримані дані:', req.body);
  
  const { title, shortDescription, fullContent, image, author } = req.body;
  
  if (!title || !shortDescription || !fullContent) {
    return res.status(400).json({ error: 'Відсутні обов\'язкові поля: title, shortDescription, fullContent' });
  }
  
  const query = `
    INSERT INTO news (title, shortDescription, fullContent, image, author) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [title, shortDescription, fullContent, image || '', author || 'Адміністрація'], (err, results) => {
    if (err) {
      console.error('❌ Помилка створення новини:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    const newNews = {
      id: results.insertId,
      title,
      shortDescription,
      fullContent,
      image: image || '',
      author: author || 'Адміністрація',
      isPublished: true,
      views: 0,
      publishDate: new Date().toISOString(),
      message: '✅ Новину успішно створено!'
    };
    
    console.log('✅ Новину створено з ID:', results.insertId);
    res.status(201).json(newNews);
  });
});

// Маршрут для GET /api/news/:id
app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;
  console.log(`✅ Обробляємо GET /api/news/${id}`);
  
  const query = 'SELECT * FROM news WHERE id = ? AND isPublished = true';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Помилка бази даних:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Новину не знайдено' });
    }
    
    res.json(results[0]);
  });
});

// Маршрут для PUT /api/news/:id
app.put('/api/news/:id', (req, res) => {
  const { id } = req.params;
  console.log(`✅ Обробляємо PUT /api/news/${id}`);
  
  const { title, shortDescription, fullContent, image, author, isPublished } = req.body;
  
  const query = `
    UPDATE news 
    SET title = ?, shortDescription = ?, fullContent = ?, image = ?, author = ?, isPublished = ?
    WHERE id = ?
  `;
  
  db.query(query, [title, shortDescription, fullContent, image, author, isPublished, id], (err, results) => {
    if (err) {
      console.error('❌ Помилка оновлення новини:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    res.json({ message: 'Новину оновлено успішно', id });
  });
});

// Маршрут для DELETE /api/news/:id
app.delete('/api/news/:id', (req, res) => {
  const { id } = req.params;
  console.log(`✅ Обробляємо DELETE /api/news/${id}`);
  
  const query = 'DELETE FROM news WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Помилка видалення новини:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }
    
    res.json({ message: 'Новину видалено успішно' });
  });
});

// ===== ІНШІ МАРШРУТИ =====

// Інші маршрути (якщо потрібні)
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/content', require('./routes/content'));
  app.use('/api/upload', require('./routes/upload'));
  app.use('/api/gallery', require('./routes/gallery')); // Додаємо маршрути галереї
} catch (error) {
  console.log('⚠️ Деякі маршрути не завантажено:', error.message);
}


// Тестові маршрути
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Сервер працює!',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /api/test',
      'GET /api/news',
      'POST /api/news',
      'GET /api/news/:id',
      'PUT /api/news/:id',
      'DELETE /api/news/:id'
    ]
  });
});

// Обробка кореневого запиту
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Сервер Уманської школи мистецтв "Антарес"',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      test: '/api/test',
      news: {
        get_all: 'GET /api/news',
        create: 'POST /api/news',
        get_one: 'GET /api/news/:id',
        update: 'PUT /api/news/:id',
        delete: 'DELETE /api/news/:id'
      }
    }
  });
});

// Обробка неіснуючих маршрутів
app.use((req, res) => {
  console.log('❌ Незнайдений маршрут:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Маршрут не знайдено',
    method: req.method,
    url: req.originalUrl
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('==========================================');
  console.log('🚀 ОСНОВНИЙ СЕРВЕР ЗАПУЩЕНО');
  console.log(`📍 Адреса: http://localhost:${PORT}`);
  console.log('==========================================');
  console.log('📋 ДОСТУПНІ МАРШРУТИ НОВИН:');
  console.log('   GET    /api/news          - Отримати всі новини');
  console.log('   POST   /api/news          - Створити новину');
  console.log('   GET    /api/news/:id      - Отримати новину по ID');
  console.log('   PUT    /api/news/:id      - Оновити новину');
  console.log('   DELETE /api/news/:id      - Видалити новину');
  console.log('==========================================');
  console.log('🔧 Перевірка в браузері:');
  console.log(`   👉 http://localhost:${PORT}/api/test`);
  console.log(`   👉 http://localhost:${PORT}/api/news`);
  console.log('==========================================');
});