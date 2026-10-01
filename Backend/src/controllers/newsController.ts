import { Request, Response } from 'express';
import NewsModel from '../models/News';
import { cacheGet, cacheSet, cacheDel, cacheDelPrefix } from '../utils/cache';
import { NewsCreateData } from '../types';
import { getVisitorKey } from '../utils/visitor';

export const getAllNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const cacheKey = `news:page:${page}:limit:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    NewsModel.getPaginated(page, limit, async (err, results) => {
      if (err) {
        console.error('Помилка отримання новин:', err);
        res.status(500).json({ error: 'Помилка сервера' });
        return;
      }

      await cacheSet(cacheKey, results || [], 45); // cache short-lived
      res.json(results || []);
    });
  } catch (error: any) {
    console.error('Помилка отримання новин:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export const getAllNewsForAdmin = (_req: Request, res: Response): void => {
  NewsModel.getAllForAdmin((err, results) => {
    if (err) {
      console.error('Помилка отримання новин для admin:', err);
      res.status(500).json({ error: 'Помилка сервера' });
      return;
    }

    res.json(results || []);
  });
};

export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Некоректний ID новини' });
      return;
    }

    const cacheKey = `news:id:${id}`;
    const visitorKey = getVisitorKey(req, res);
    NewsModel.recordView(id, visitorKey, async (viewError) => {
      if (viewError) {
        console.error('Помилка запису перегляду:', viewError);
      }

      await cacheDel(cacheKey);
      const cached = await cacheGet(cacheKey);
      if (cached) {
        res.json(cached);
        return;
      }

      NewsModel.getById(id, async (err, result) => {
        if (err) {
          console.error('Помилка бази даних:', err);
          res.status(500).json({ error: 'Помилка сервера' });
          return;
        }

        if (!result) {
          res.status(404).json({ error: 'Новину не знайдено' });
          return;
        }

        await cacheSet(cacheKey, result, 60 * 5);
        res.json(result);
      });
    });
  } catch (error: any) {
    console.error('Помилка отримання новини:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, shortDescription, fullContent, image, author, isPublished } = req.body as NewsCreateData & {
      isPublished?: boolean;
    };
    const authorId = (req as any).user?.userId || 1;

    if (!title || !shortDescription || !fullContent) {
      res.status(400).json({ error: 'Поля title, shortDescription та fullContent обов\'язкові' });
      return;
    }

    NewsModel.create(
      { title, shortDescription, fullContent, image, author, isPublished, authorId },
      (err, result: any) => {
      if (err) {
        console.error('Помилка створення новини:', err);
        res.status(500).json({ error: 'Помилка сервера' });
        return;
      }

      cacheDelPrefix('news:').finally(() => {
        res.status(201).json({
          message: 'Новину створено успішно',
          id: result?.insertId,
        });
      });
      }
    );
  } catch (error: any) {
    console.error('Помилка створення новини:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const authorId = (req as any).user?.userId || 1;

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Некоректний ID новини' });
      return;
    }

    NewsModel.update(id, { ...(req.body || {}), authorId }, (err, result: any) => {
      if (err) {
        console.error('Помилка оновлення новини:', err);
        res.status(500).json({ error: 'Помилка сервера' });
        return;
      }

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ error: 'Новину не знайдено' });
        return;
      }

      cacheDelPrefix('news:').finally(() => {
        res.json({ message: 'Новину оновлено успішно' });
      });
    });
  } catch (error: any) {
    console.error('Помилка оновлення новини:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};

export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Некоректний ID новини' });
      return;
    }

    NewsModel.delete(id, (err, result: any) => {
      if (err) {
        console.error('Помилка видалення новини:', err);
        res.status(500).json({ error: 'Помилка сервера' });
        return;
      }

      if (!result || result.affectedRows === 0) {
        res.status(404).json({ error: 'Новину не знайдено' });
        return;
      }

      cacheDelPrefix('news:').finally(() => {
        res.json({ message: 'Новину видалено успішно' });
      });
    });
  } catch (error: any) {
    console.error('Помилка видалення новини:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
};
