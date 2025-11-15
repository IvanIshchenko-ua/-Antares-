const authMiddleware = require('../middleware/auth');

exports.getUsers = [
  authMiddleware,
  (req, res) => {
    db.query('SELECT id, username, email, created_at FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  }
];