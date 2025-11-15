const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Додайте middleware для парсингу JSON для цих конкретних маршрутів
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify', authController.verifyToken)

module.exports = router;