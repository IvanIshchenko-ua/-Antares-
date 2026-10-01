import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { deleteFile, listFiles, uploadFile, getPresignedPutUrl } from '../services/r2Service';
import { enqueueFileProcess } from '../utils/queue';
import { authMiddleware, requireAdmin } from '../middleware/auth';

const router = Router();

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Only image and document files are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});

router.post('/', authMiddleware, requireAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const category = String(req.body?.category || 'general');
    const folder = category === 'transparency' ? 'transparency' : 'general';

    const extension = req.file.originalname.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${timestamp}-${random}.${extension}`;

    const fileUrl = await uploadFile(req.file.buffer, fileName, req.file.mimetype);

    // Enqueue background processing (thumbnailing, indexing, etc.)
    enqueueFileProcess({ filename: fileName, originalName: req.file.originalname }).catch(() => {});

    res.status(202).json({
      success: true,
      url: fileUrl,
      filename: fileName,
      originalName: req.file.originalname,
      queued: true,
    });
  } catch (error: any) {
    console.error('❌ R2 Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Presign endpoint for direct-to-R2 uploads from client
router.post('/presign', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { filename, contentType } = req.body as { filename?: string; contentType?: string };
    if (!filename || !contentType) {
      res.status(400).json({ error: 'filename and contentType required' });
      return;
    }

    const url = await getPresignedPutUrl(filename, contentType);
    res.json({ url, publicUrl: `${process.env.R2_PUBLIC_URL}/${filename}` });
  } catch (err: any) {
    console.error('Presign error', err);
    res.status(500).json({ error: 'Presign failed' });
  }
});

// Client notifies backend that upload is complete so backend can enqueue processing
router.post('/complete', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { filename, originalName } = req.body as { filename?: string; originalName?: string };
    if (!filename) {
      res.status(400).json({ error: 'filename required' });
      return;
    }

    await enqueueFileProcess({ filename, originalName });
    res.json({ success: true, queued: true });
  } catch (err: any) {
    console.error('Complete enqueue error', err);
    res.status(500).json({ error: 'Enqueue failed' });
  }
});

router.delete('/:filename', authMiddleware, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    await deleteFile(filename);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ R2 Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

router.get('/', authMiddleware, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const files = await listFiles();
    const fileList = files.map((file) => ({
      url: `${process.env.R2_PUBLIC_URL}/${file.Key}`,
      filename: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));

    res.json(fileList);
  } catch (error: any) {
    console.error('❌ R2 List error:', error);
    res.status(500).json({
      error: 'Error getting files',
      details: error.message,
    });
  }
});

export default router;
