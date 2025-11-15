const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'admin_panel_db'
});

const Gallery = {
  // Отримати всі зображення галереї
  getAll: (callback) => {
    db.query('SELECT * FROM gallery WHERE is_published = true ORDER BY created_at DESC', callback);
  },

  // Отримати зображення по ID
  getById: (id, callback) => {
    db.query('SELECT * FROM gallery WHERE id = ? AND is_published = true', [id], callback);
  },

  // Створити нове зображення в галереї
  create: (data, callback) => {
    const { title, description, image_url, category } = data;
    db.query(
      'INSERT INTO gallery (title, description, image_url, category) VALUES (?, ?, ?, ?)',
      [title, description || '', image_url, category || 'general'],
      callback
    );
  },

  // Оновити зображення в галереї
  update: (id, data, callback) => {
    const { title, description, image_url, category, is_published } = data;
    db.query(
      'UPDATE gallery SET title = ?, description = ?, image_url = ?, category = ?, is_published = ? WHERE id = ?',
      [title, description, image_url, category, is_published, id],
      callback
    );
  },

  // Видалити зображення з галереї
  delete: (id, callback) => {
    db.query('DELETE FROM gallery WHERE id = ?', [id], callback);
  }
};

module.exports = Gallery;