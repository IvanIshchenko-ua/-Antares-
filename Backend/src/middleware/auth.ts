import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from '../types';

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    _res.status(401).json({ success: false, message: 'Потрібна авторизація' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      _res.status(503).json({ success: false, message: 'Авторизація тимчасово недоступна' });
      return;
    }

    const decoded = jwt.verify(
      token,
      jwtSecret
    ) as JWTPayload;

    if (!decoded.userId || !decoded.email || !decoded.role) {
      _res.status(401).json({ success: false, message: 'Недійсний токен' });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    _res.status(401).json({ success: false, message: 'Недійсний токен' });
  }
};

export const optionalAuthMiddleware = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    if (decoded.userId && decoded.email && decoded.role) {
      req.user = decoded;
    }
  } catch {
    // Public news remains available when an optional token is expired.
  }

  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Недостатньо прав' });
    return;
  }

  next();
};
