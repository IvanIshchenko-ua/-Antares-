const db = require('../db');

const User = {
  // Отримати всіх користувачів
  getAllUsers: (callback) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Database error in getAllUsers:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // Створити користувача
  createUser: (username, email, password, callback) => {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
      if (err) {
        console.error('❌ Database error in createUser:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // Знайти користувача по email
  getUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('❌ Database error in getUserByEmail:', err);
        return callback(err, null);
      }
      callback(null, results[0]); // Повертаємо перший результат
    });
  },

  // Знайти користувача по ID
  getUserById: (id, callback) => {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('❌ Database error in getUserById:', err);
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  }
};

module.exports = User;