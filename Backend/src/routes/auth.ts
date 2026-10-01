import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: { success: false, message: 'Забагато спроб входу. Спробуйте пізніше.' },
});

router.post('/login', loginLimiter, authController.login);
router.post('/register', authController.register);
router.get('/verify', authMiddleware, authController.verifyToken);
router.get('/users', authMiddleware, requireAdmin, authController.getUsers);

export default router;
