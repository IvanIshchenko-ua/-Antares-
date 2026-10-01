import { Router } from 'express';
import {
  getAllTransparency,
  getTransparencyByType,
  updateTransparencyByType,
} from '../controllers/transparencyController';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllTransparency);
router.get('/:sectionType', getTransparencyByType);
router.put('/:sectionType', authMiddleware, requireAdmin, updateTransparencyByType);

export default router;
