import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { sendSignupToTelegram, SignupPayload } from '../services/signupTelegram';

const router = Router();

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

router.post('/', signupLimiter, async (req: Request, res: Response) => {
  const payload = req.body as SignupPayload;

  if (!payload?.name?.trim() || !payload?.phone?.trim()) {
    return res.status(400).json({ error: 'Ім’я та телефон є обов’язковими' });
  }

  try {
    await sendSignupToTelegram(payload);
    return res.status(202).json({ ok: true });
  } catch (error) {
    console.error('Signup Telegram error:', error);
    return res.status(503).json({ error: 'Не вдалося надіслати заявку' });
  }
});

export default router;
