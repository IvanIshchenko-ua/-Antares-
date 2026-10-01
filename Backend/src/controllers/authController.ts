import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';
import { AuthRequest, LoginRequest, RegisterRequest } from '../types';

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;
    const identifier = email;

    if (
      typeof identifier !== 'string' ||
      typeof password !== 'string' ||
      !identifier.trim() ||
      password.length < 1 ||
      identifier.length > 160 ||
      password.length > 256
    ) {
      console.log('❌ Missing login/email or password');
      res.status(400).json({
        success: false,
        message: 'Логін (або email) і пароль обов\'язкові',
      });
      return;
    }

    UserModel.getUserByEmailOrUsername(identifier, async (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        res.status(500).json({
          success: false,
          message: 'Помилка бази даних',
        });
        return;
      }

      if (!user) {
        console.log('❌ User not found with identifier:', identifier);
        res.status(400).json({
          success: false,
          message: 'Користувача не знайдено',
        });
        return;
      }

      console.log('✅ User found:', { id: user.id, email: user.email });
      console.log('🔑 Comparing password with bcrypt');

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('❌ Bcrypt compare error:', err);
          res.status(500).json({
            success: false,
            message: 'Помилка сервера',
          });
          return;
        }

        if (!result) {
          console.log('❌ Password does not match for user:', identifier);
          res.status(400).json({
            success: false,
            message: 'Невірний пароль',
          });
          return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          res.status(503).json({ success: false, message: 'Авторизація тимчасово недоступна' });
          return;
        }

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
          jwtSecret,
          { expiresIn: '24h' }
        );

        console.log('✅ Login successful for user:', identifier);

        res.json({
          success: true,
          message: 'Успішний вхід',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      });
    });
  } catch (error: any) {
    console.error('❌ Login unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as RegisterRequest;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !/^[a-zA-Z0-9_.-]{3,64}$/.test(username) ||
      !emailPattern.test(email) ||
      password.length < 12 ||
      password.length > 256
    ) {
      console.log('❌ Missing required fields');
      res.status(400).json({
        success: false,
        message: 'Всі поля обов\'язкові',
      });
      return;
    }

    UserModel.getUserByEmail(email, (err, existingUser) => {
      if (err) {
        console.error('❌ Database error checking existing user:', err);
        res.status(500).json({
          success: false,
          message: 'Помилка бази даних',
        });
        return;
      }

      if (existingUser) {
        console.log('❌ User already exists with email:', email);
        res.status(400).json({
          success: false,
          message: 'Користувач з таким email вже існує',
        });
        return;
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('❌ Bcrypt hash error:', err);
          res.status(500).json({
            success: false,
            message: 'Помилка сервера',
          });
          return;
        }

        console.log('🔑 Password hashed on backend');

        UserModel.createUser(username as string, email as string, hashedPassword as string, (err, result) => {
          if (err) {
            console.error('❌ Database error in createUser:', err);
            res.status(500).json({
              success: false,
              message: 'Помилка бази даних: ' + err.message,
            });
            return;
          }

          console.log('✅ User created successfully:', result);
          cacheDel('users:all').catch(() => {});
          res.status(201).json({
            success: true,
            message: 'Користувача успішно зареєстровано',
            userId: result.insertId,
          });
        });
      });
    });
  } catch (error: any) {
    console.error('❌ Register unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

export const verifyToken = (req: AuthRequest, res: Response): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Токен відсутній',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(503).json({ success: false, message: 'Авторизація тимчасово недоступна' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret);

    res.json({
      success: true,
      user: decoded,
    });
  } catch (error: any) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Недійсний токен',
    });
  }
};

export const getUsers = (_req: AuthRequest, res: Response): void => {
  try {
    (async () => {
      const cacheKey = 'users:all';
      const cached = await cacheGet(cacheKey);
      if (cached) {
        res.json({ success: true, users: cached });
        return;
      }

      UserModel.getAllUsers(async (err, users) => {
        if (err) {
          console.error('❌ Error fetching users:', err);
          res.status(500).json({ success: false, message: 'Помилка бази даних' });
          return;
        }

        const safe = (users || []).map(u => ({ id: u.id, username: u.username, email: u.email, created_at: u.created_at }));
        await cacheSet(cacheKey, safe, 120);
        res.json({ success: true, users: safe });
      });
    })();
  } catch (error: any) {
    console.error('❌ getUsers unexpected error:', error);
    res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};
