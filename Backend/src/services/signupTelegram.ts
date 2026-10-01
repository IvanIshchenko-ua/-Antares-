import https from 'node:https';

export type SignupPayload = {
  name: string;
  phone: string;
  email?: string;
  childName?: string;
  department?: string;
  subject?: string;
  message?: string;
  source?: string;
};

const escapeHtml = (value: unknown): string => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const sendSignupToTelegram = async (payload: SignupPayload): Promise<void> => {
  const token = process.env.SIGNUP_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.SIGNUP_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error('Signup Telegram bot is not configured');
  }

  const lines = [
    '<b>Нова заявка на запис</b>',
    '',
    `<b>Ім’я:</b> ${escapeHtml(payload.name)}`,
    `<b>Телефон:</b> ${escapeHtml(payload.phone)}`,
    payload.email ? `<b>Email:</b> ${escapeHtml(payload.email)}` : '',
    payload.childName ? `<b>Дитина:</b> ${escapeHtml(payload.childName)}` : '',
    payload.department ? `<b>Напрям:</b> ${escapeHtml(payload.department)}` : '',
    payload.subject ? `<b>Тема:</b> ${escapeHtml(payload.subject)}` : '',
    payload.message ? `<b>Повідомлення:</b> ${escapeHtml(payload.message)}` : '',
    payload.source ? `<b>Джерело:</b> ${escapeHtml(payload.source)}` : '',
  ].filter(Boolean).join('\n');

  const body = JSON.stringify({
    chat_id: chatId,
    text: lines,
    parse_mode: 'HTML',
  });

  await new Promise<void>((resolve, reject) => {
    const request = https.request(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (response) => {
        let responseBody = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { responseBody += chunk; });
        response.on('end', () => {
          let result: { ok?: boolean; description?: string } = {};
          try { result = JSON.parse(responseBody); } catch { /* handled by status */ }
          if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300 && result.ok) {
            resolve();
          } else {
            reject(new Error(result.description || `Telegram API returned ${response.statusCode}`));
          }
        });
      },
    );

    request.on('error', reject);
    request.write(body);
    request.end();
  });
};
