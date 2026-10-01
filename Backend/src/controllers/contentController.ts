import { Request, Response } from 'express';
import ContentModel from '../models/Content';
import { cacheGet, cacheSet, cacheDel } from '../utils/cache';

export const getPageContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageName } = req.params;

    if (!pageName) {
      res.status(400).json({ error: 'pageName is required' });
      return;
    }

    const cacheKey = `content:page:${pageName}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    ContentModel.getContent(pageName, async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (!result) {
        const fallback = { content: '', message: 'Page not found, using default template' };
        await cacheSet(cacheKey, fallback, 60);
        res.json(fallback);
        return;
      }

      await cacheSet(cacheKey, result, 60);
      res.json(result);
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePageContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageName } = req.params;
    const { content } = req.body as { content?: string };

    if (!pageName) {
      res.status(400).json({ error: 'pageName is required' });
      return;
    }

    if (typeof content !== 'string') {
      res.status(400).json({ error: 'content must be a string' });
      return;
    }

    ContentModel.getContent(pageName, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }

      if (!result) {
        ContentModel.saveContent(pageName, content, async (saveErr, saveResult: any) => {
          if (saveErr) {
            console.error('Save error:', saveErr);
            res.status(500).json({ error: saveErr.message });
            return;
          }

          await cacheDel(`content:page:${pageName}`);
          res.json({ message: 'Content created successfully', id: saveResult?.insertId });
        });
        return;
      }

      ContentModel.updateContent(pageName, content, async (updateErr) => {
        if (updateErr) {
          console.error('Update error:', updateErr);
          res.status(500).json({ error: updateErr.message });
          return;
        }

        await cacheDel(`content:page:${pageName}`);
        res.json({ message: 'Content updated successfully' });
      });
    });
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
