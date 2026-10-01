import { Router } from 'express';
import { getPageContent, updatePageContent } from '../controllers/contentController';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/:pageName', getPageContent);
router.put('/:pageName', authMiddleware, requireAdmin, updatePageContent);

export default router;
