const Gallery = require('../models/Gallery');

const galleryController = {
  // Отримати всі зображення галереї
  getAllImages: async (req, res) => {
    try {
      Gallery.getAll((err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ images: results });
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Отримати одне зображення по ID
  getImageById: async (req, res) => {
    try {
      const { id } = req.params;
      
      Gallery.getById(id, (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: err.message });
        }
        
        if (results.length === 0) {
          return res.status(404).json({ error: 'Image not found' });
        }
        
        res.json(results[0]);
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Створити нове зображення в галереї
  createImage: async (req, res) => {
    try {
      const { title, description, image_url, category } = req.body;
      
      if (!title || !image_url) {
        return res.status(400).json({ error: 'Title and image_url are required' });
      }
      
      Gallery.create({ title, description, image_url, category }, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: err.message });
        }
        
        res.status(201).json({ 
          message: 'Image added to gallery successfully',
          id: result.insertId 
        });
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Оновити зображення в галереї
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, image_url, category, is_published } = req.body;
      
      Gallery.update(id, { title, description, image_url, category, is_published }, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Image not found' });
        }
        
        res.json({ message: 'Image updated successfully' });
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Видалити зображення з галереї
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;
      
      Gallery.delete(id, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Image not found' });
        }
        
        res.json({ message: 'Image deleted successfully' });
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = galleryController;