const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt - body:', req.body);
    
    const { email, password } = req.body;
    
    // Перевірка вхідних даних
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Email і пароль обов\'язкові' 
      });
    }

    // Шукаємо користувача по email
    User.getUserByEmail(email, async (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Помилка бази даних' 
        });
      }

      if (!user) {
        console.log('❌ User not found with email:', email);
        return res.status(400).json({ 
          success: false,
          message: 'Користувача не знайдено' 
        });
      }

      console.log('✅ User found:', { id: user.id, email: user.email });
      console.log('🔑 Comparing password with bcrypt');

      // Порівнюємо оригінальний пароль з хешем у базі даних
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('❌ Bcrypt compare error:', err);
          return res.status(500).json({ 
            success: false,
            message: 'Помилка сервера' 
          });
        }

        if (!result) {
          console.log('❌ Password does not match for user:', email);
          return res.status(400).json({ 
            success: false,
            message: 'Невірний пароль' 
          });
        }

        // Створюємо JWT токен
        const token = jwt.sign(
          { 
            userId: user.id,
            email: user.email 
          }, 
          process.env.JWT_SECRET || 'fallback_secret_antares', 
          { expiresIn: '24h' }
        );

        console.log('✅ Login successful for user:', email);
        
        res.json({ 
          success: true,
          message: 'Успішний вхід',
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email 
          } 
        });
      });
    });

  } catch (error) {
    console.error('❌ Login unexpected error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Внутрішня помилка сервера' 
    });
  }
};

const register = async (req, res) => {
  try {
    console.log('📝 Registration attempt - body:', req.body);
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Всі поля обов\'язкові' 
      });
    }

    // Перевіряємо, чи існує вже користувач з таким email
    User.getUserByEmail(email, (err, existingUser) => {
      if (err) {
        console.error('❌ Database error checking existing user:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Помилка бази даних' 
        });
      }

      if (existingUser) {
        console.log('❌ User already exists with email:', email);
        return res.status(400).json({ 
          success: false,
          message: 'Користувач з таким email вже існує' 
        });
      }

      // Хешуємо пароль на бекенді
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('❌ Bcrypt hash error:', err);
          return res.status(500).json({ 
            success: false,
            message: 'Помилка сервера' 
          });
        }

        console.log('🔑 Password hashed on backend');
        
        // Створюємо користувача
        User.createUser(username, email, hashedPassword, (err, result) => {
          if (err) {
            console.error('❌ Database error in createUser:', err);
            return res.status(500).json({ 
              success: false,
              message: 'Помилка бази даних: ' + err.message 
            });
          }
          
          console.log('✅ User created successfully:', result);
          
          res.status(201).json({ 
            success: true,
            message: 'Користувача успішно зареєстровано',
            userId: result.insertId 
          });
        });
      });
    });

  } catch (error) {
    console.error('❌ Register unexpected error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Внутрішня помилка сервера: ' + error.message 
    });
  }
};

// Додаємо функцію для перевірки токена
const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен відсутній'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_antares');
    
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Недійсний токен'
    });
  }
};

module.exports = { login, register, verifyToken };
