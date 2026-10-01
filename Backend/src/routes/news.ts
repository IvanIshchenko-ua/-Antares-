import { Router } from 'express';
import {
  createNews,
  deleteNews,
  getAllNews,
  getAllNewsForAdmin,
  getNewsById,
  updateNews,
} from '../controllers/newsController';
import { authMiddleware, optionalAuthMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/admin', authMiddleware, requireAdmin, getAllNewsForAdmin);
router.get('/', optionalAuthMiddleware, getAllNews);
router.get('/:id', optionalAuthMiddleware, getNewsById);
router.post('/', authMiddleware, requireAdmin, createNews);
router.put('/:id', authMiddleware, requireAdmin, updateNews);
router.delete('/:id', authMiddleware, requireAdmin, deleteNews);

export default router;
