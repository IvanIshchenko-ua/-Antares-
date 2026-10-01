import { Request, Response } from 'express';
import GalleryModel from '../models/Gallery';
import { GalleryImage } from '../types';
import { cacheGet, cacheSet, cacheDelPrefix, cacheDel } from '../utils/cache';

export const getAllImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const cacheKey = `gallery:page:${page}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json({ images: cached });
      return;
    }

    GalleryModel.getAll((err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      const pageResults = (results || []).slice((page - 1) * limit, page * limit);
      cacheSet(cacheKey, pageResults, 45);
      res.json({ images: pageResults });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getImageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid image id' });
      return;
    }

    GalleryModel.getById(id, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!result) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.json(result);
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, image_url, category } = req.body as Partial<GalleryImage>;

    if (!title || !image_url) {
      res.status(400).json({ error: 'Title and image_url are required' });
      return;
    }

    GalleryModel.create({ title, description, image_url, category }, async (err, result: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      await cacheDelPrefix('gallery:');
      res.status(201).json({
        message: 'Image added to gallery successfully',
        id: result?.insertId,
      });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid image id' });
      return;
    }

    const { title, description, image_url, category, is_published } = req.body as Partial<GalleryImage>;

    GalleryModel.update(id, { title, description, image_url, category, is_published }, async (err, result: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      await cacheDelPrefix('gallery:');
      await cacheDel(`gallery:id:${id}`);
      res.json({ message: 'Image updated successfully' });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid image id' });
      return;
    }

    GalleryModel.delete(id, async (err, result: any) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      await cacheDelPrefix('gallery:');
      await cacheDel(`gallery:id:${id}`);
      res.json({ message: 'Image deleted successfully' });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
