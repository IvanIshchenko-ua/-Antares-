import { Router } from 'express';
import {
  createImage,
  deleteImage,
  getAllImages,
  getImageById,
  updateImage,
} from '../controllers/galleryController';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', authMiddleware, requireAdmin, createImage);
router.put('/:id', authMiddleware, requireAdmin, updateImage);
router.delete('/:id', authMiddleware, requireAdmin, deleteImage);

export default router;
