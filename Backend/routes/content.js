const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const authMiddleware = require('../middleware/auth');

// Отримати контент сторінки
router.get('/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params;
    console.log('Getting content for page:', pageName);
    
    Content.getContent(pageName, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        console.log('Page not found, returning empty content');
        return res.json({ 
          content: '', 
          message: 'Page not found, using default template' 
        });
      }
      
      console.log('Content found:', results[0]);
      res.json(results[0]);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Оновити контент сторінки
router.put('/:pageName', async (req, res) => {
  try {
    const { pageName } = req.params;
    const { content } = req.body;
    
    console.log('Updating content for page:', pageName);
    console.log('New content:', content);

    Content.getContent(pageName, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        // Створити новий запис
        Content.saveContent(pageName, content, (err, result) => {
          if (err) {
            console.error('Save error:', err);
            return res.status(500).json({ error: err.message });
          }
          console.log('Content created successfully');
          res.json({ message: 'Content created successfully', id: result.insertId });
        });
      } else {
        // Оновити існуючий
        Content.updateContent(pageName, content, (err, result) => {
          if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ error: err.message });
          }
          console.log('Content updated successfully');
          res.json({ message: 'Content updated successfully' });
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;