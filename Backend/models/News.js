const db = require('../db');

const News = {
  // Отримати всі новини
  getAll: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM news WHERE isPublished = true ORDER BY publishDate DESC';
      console.log('Executing SQL:', query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('SQL Error:', err);
          reject(err);
        } else {
          console.log('SQL Results:', results);
          resolve(results);
        }
      });
    });
  },

  // Отримати новину по ID
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM news WHERE id = ? AND isPublished = true';
      console.log('Executing SQL:', query, 'with id:', id);
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('SQL Error:', err);
          reject(err);
        } else {
          console.log('SQL Results:', results);
          resolve(results[0]);
        }
      });
    });
  },

  // Створити новину
  create: (newsData) => {
    return new Promise((resolve, reject) => {
      const { title, shortDescription, fullContent, image, author } = newsData;
      const query = `
        INSERT INTO news (title, shortDescription, fullContent, image, author) 
        VALUES (?, ?, ?, ?, ?)
      `;
      console.log('Executing SQL:', query, 'with data:', [title, shortDescription, fullContent, image, author]);
      
      db.query(query, [title, shortDescription, fullContent, image, author || 'Адміністрація'], (err, results) => {
        if (err) {
          console.error('SQL Error:', err);
          reject(err);
        } else {
          console.log('SQL Results - Insert ID:', results.insertId);
          resolve({ id: results.insertId, ...newsData });
        }
      });
    });
  },

  // Оновити новину
  update: (id, newsData) => {
    return new Promise((resolve, reject) => {
      const { title, shortDescription, fullContent, image, author, isPublished } = newsData;
      const query = `
        UPDATE news 
        SET title = ?, shortDescription = ?, fullContent = ?, image = ?, author = ?, isPublished = ?
        WHERE id = ?
      `;
      console.log('Executing SQL:', query, 'with data:', [title, shortDescription, fullContent, image, author, isPublished, id]);
      
      db.query(query, [title, shortDescription, fullContent, image, author, isPublished, id], (err, results) => {
        if (err) {
          console.error('SQL Error:', err);
          reject(err);
        } else {
          console.log('SQL Results - Affected rows:', results.affectedRows);
          resolve(results);
        }
      });
    });
  },

  // Видалити новину
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM news WHERE id = ?';
      console.log('Executing SQL:', query, 'with id:', id);
      
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('SQL Error:', err);
          reject(err);
        } else {
          console.log('SQL Results - Affected rows:', results.affectedRows);
          resolve(results);
        }
      });
    });
  },

  // Збільшити лічильник переглядів
  incrementViews: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE news SET views = views + 1 WHERE id = ?';
      console.log('Executing SQL:', query, 'with id:', id);
      
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('SQL Error:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = News;