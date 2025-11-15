const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// Отримати всі зображення галереї
router.get('/', async (req, res) => {
  try {
    console.log('✅ Обробляємо GET /api/gallery');
    
    Gallery.getAll((err, results) => {
      if (err) {
        console.error('❌ Помилка бази даних:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      
      console.log(`✅ Знайдено ${results.length} зображень`);
      res.json({ images: results });
    });
  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

// Отримати одне зображення по ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✅ Обробляємо GET /api/gallery/${id}`);
    
    Gallery.getById(id, (err, results) => {
      if (err) {
        console.error('❌ Помилка бази даних:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Зображення не знайдено' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

// Створити нове зображення в галереї
router.post('/', async (req, res) => {
  try {
    console.log('✅ Обробляємо POST /api/gallery');
    console.log('📦 Отримані дані:', req.body);
    
    const { title, description, image_url, category } = req.body;
    
    if (!title || !image_url) {
      return res.status(400).json({ error: 'Відсутні обов\'язкові поля: title, image_url' });
    }
    
    Gallery.create({ title, description, image_url, category }, (err, result) => {
      if (err) {
        console.error('❌ Помилка створення зображення:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      
      const newImage = {
        id: result.insertId,
        title,
        description,
        image_url,
        category: category || 'general',
        is_published: true,
        message: '✅ Зображення успішно додано до галереї!'
      };
      
      console.log('✅ Зображення створено з ID:', result.insertId);
      res.status(201).json(newImage);
    });
  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

// Оновити зображення в галереї
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✅ Обробляємо PUT /api/gallery/${id}`);
    
    const { title, description, image_url, category, is_published } = req.body;
    
    Gallery.update(id, { title, description, image_url, category, is_published }, (err, result) => {
      if (err) {
        console.error('❌ Помилка оновлення зображення:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Зображення не знайдено' });
      }
      
      res.json({ message: 'Зображення оновлено успішно', id });
    });
  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

// Видалити зображення з галереї
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✅ Обробляємо DELETE /api/gallery/${id}`);
    
    Gallery.delete(id, (err, result) => {
      if (err) {
        console.error('❌ Помилка видалення зображення:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Зображення не знайдено' });
      }
      
      res.json({ message: 'Зображення видалено успішно' });
    });
  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

// В routes/gallery.js додайте цей маршрут:
router.post('/', async (req, res) => {
  try {
    console.log('✅ Обробляємо POST /api/gallery');
    console.log('📦 Отримані дані:', req.body);
    
    const { title, description, image_url, category } = req.body;
    
    if (!title || !image_url) {
      return res.status(400).json({ error: 'Відсутні обов\'язкові поля: title, image_url' });
    }
    
    // Вставка в базу даних
    const query = `
      INSERT INTO gallery (title, description, image_url, category) 
      VALUES (?, ?, ?, ?)
    `;
    
    db.query(query, [title, description || '', image_url, category || 'general'], (err, result) => {
      if (err) {
        console.error('❌ Помилка створення запису в галереї:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      
      const newImage = {
        id: result.insertId,
        title,
        description: description || '',
        image_url,
        category: category || 'general',
        is_published: true,
        created_at: new Date().toISOString()
      };
      
      console.log('✅ Запис створено з ID:', result.insertId);
      res.status(201).json(newImage);
    });
  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;