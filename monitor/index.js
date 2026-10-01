/**
 * Antares Watchdog - Автоматичний моніторинг доступності сайту та його елементів
 * Сповіщення на телефон у Telegram при збоях та відновленні.
 */

const http = require('http');
const https = require('https');
const net = require('net');
const fs = require('fs');
const path = require('path');

// Спроба автоматично завантажити .env якщо запущено локально
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}
loadEnv();

// Визначення середовища (Docker чи локальний Mac/PC)
const isDocker = fs.existsSync('/.dockerenv') || process.env.IS_DOCKER === 'true';

// Конфігурація
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
let CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const CHECK_INTERVAL_SEC = Math.max(10, parseInt(process.env.CHECK_INTERVAL_SEC || '30', 10));
const FAIL_THRESHOLD = Math.max(1, parseInt(process.env.FAIL_THRESHOLD || '2', 10)); // Кількість поспіль невдалих перевірок перед тривогою
const REMINDER_INTERVAL_MIN = parseInt(process.env.REMINDER_INTERVAL_MIN || '60', 10);

const SITE_URL = process.env.SITE_URL || 'https://antares-uman.art';
// У Docker контейнерах назви сервісів: frontend, backend, db, redis
// При локальному запуску (node monitor/index.js): localhost:3000, localhost:5002, localhost:3306, localhost:6379
const FRONTEND_URL = process.env.FRONTEND_URL || (isDocker ? 'http://frontend:80' : 'http://localhost:3000');
const BACKEND_URL = process.env.BACKEND_URL || (isDocker ? 'http://backend:5002' : 'http://localhost:5002');
const DB_HOST = process.env.DB_HOST || (isDocker ? 'db' : 'localhost');
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const REDIS_HOST = process.env.REDIS_HOST || (isDocker ? 'redis' : 'localhost');
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

// Перелік елементів для моніторингу
const elements = [
  {
    id: 'public_site',
    name: '🌐 Публічний сайт (Інтернет / Домен)',
    description: 'Доступність сайту ззовні для користувачів',
    check: () => checkHttp(SITE_URL, { timeoutMs: 10000 }),
  },
  {
    id: 'frontend',
    name: '💻 Frontend контейнер',
    description: 'Внутрішній веб-сервер React/Nginx',
    check: () => checkHttp(FRONTEND_URL, { timeoutMs: 5000 }),
  },
  {
    id: 'backend_api',
    name: '⚙️ Backend API (Сервер застосунку)',
    description: 'Головний сервіс Express API',
    check: () => checkHttp(`${BACKEND_URL}/health`, { timeoutMs: 5000 }),
  },
  {
    id: 'database',
    name: '🗄 База даних MySQL',
    description: 'Порт 3306 сервера бази даних',
    check: () => checkTcp(DB_HOST, DB_PORT, 4000),
  },
  {
    id: 'redis',
    name: '⚡️ Redis Кеш',
    description: 'Порт 6379 сервера кешування',
    check: () => checkTcp(REDIS_HOST, REDIS_PORT, 4000),
  },
  {
    id: 'api_news',
    name: '📰 Модуль Новин (/api/news)',
    description: 'Отримання списку шкільних новин',
    check: () => checkHttp(`${BACKEND_URL}/api/news`, { timeoutMs: 5000 }),
  },
  {
    id: 'api_gallery',
    name: '🖼 Модуль Галереї (/api/gallery)',
    description: 'Завантаження фотогалереї',
    check: () => checkHttp(`${BACKEND_URL}/api/gallery`, { timeoutMs: 5000 }),
  },
  {
    id: 'api_transparency',
    name: '📄 Модуль Прозорості (/api/transparency)',
    description: 'Офіційні шкільні документи',
    check: () => checkHttp(`${BACKEND_URL}/api/transparency`, { timeoutMs: 5000 }),
  },
  {
    id: 'backend_detailed',
    name: '🩺 Детальний статус бекенду (/health/detailed)',
    description: 'Внутрішня перевірка зєднань бекенда з БД та Redis',
    check: () => checkHttp(`${BACKEND_URL}/health/detailed`, { timeoutMs: 5000 }),
  },
];

// Стан кожного елемента
const state = new Map();
for (const el of elements) {
  state.set(el.id, {
    status: 'UNKNOWN', // 'UP', 'DOWN', 'UNKNOWN'
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
    downSince: null,
    lastAlertSentAt: null,
    lastError: null,
    lastDurationMs: null,
    lastCheckedAt: null,
  });
}

// Форматування тривалості простою
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  if (totalSec < 60) return `${totalSec} сек`;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes < 60) return `${minutes} хв ${seconds} сек`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return `${hours} год ${remMinutes} хв`;
}

// Форматування часу (Київ)
function formatKyivTime(date = new Date()) {
  return date.toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Перевірка через HTTP/HTTPS
async function checkHttp(url, options = {}) {
  const timeoutMs = options.timeoutMs || 5000;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Antares-Watchdog/1.0',
        ...(options.headers || {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const duration = Date.now() - start;
    if (res.status >= 200 && res.status < 400) {
      return { ok: true, duration, message: `HTTP ${res.status} (${duration}ms)` };
    } else {
      return { ok: false, duration, message: `HTTP ${res.status} ${res.statusText || 'Error'}` };
    }
  } catch (err) {
    const duration = Date.now() - start;
    const msg = err.name === 'TimeoutError' ? `Таймаут відповіді (${timeoutMs}ms)` : (err.message || String(err));
    return { ok: false, duration, message: msg };
  }
}

// Перевірка через TCP порт
function checkTcp(host, port, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let responded = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      if (responded) return;
      responded = true;
      const duration = Date.now() - start;
      socket.destroy();
      resolve({ ok: true, duration, message: `Підключено за ${duration}ms` });
    });

    socket.on('timeout', () => {
      if (responded) return;
      responded = true;
      socket.destroy();
      resolve({ ok: false, duration: Date.now() - start, message: `Таймаут TCP з'єднання (${timeoutMs}ms)` });
    });

    socket.on('error', (err) => {
      if (responded) return;
      responded = true;
      socket.destroy();
      resolve({ ok: false, duration: Date.now() - start, message: err.message || 'Помилка TCP зєднання' });
    });

    socket.connect(port, host);
  });
}

// Надсилання повідомлення в Telegram
async function sendTelegram(text, targetChatId = CHAT_ID) {
  if (!BOT_TOKEN) {
    console.log('[WATCHDOG DRY-RUN] Telegram токен відсутній. Повідомлення:\n', text);
    return false;
  }
  if (!targetChatId) {
    console.log('[WATCHDOG DRY-RUN] Chat ID відсутній. Повідомлення:\n', text);
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error('❌ Помилка Telegram API:', data.description);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Не вдалося надіслати сповіщення в Telegram:', err.message);
    return false;
  }
}

// Обробка результату перевірки одного елемента
async function handleCheckResult(el, result) {
  const s = state.get(el.id);
  s.lastCheckedAt = new Date();
  s.lastDurationMs = result.duration;

  if (result.ok) {
    s.consecutiveSuccesses += 1;
    s.consecutiveFailures = 0;
    s.lastError = null;

    // Якщо раніше був збій (DOWN)
    if (s.status === 'DOWN') {
      const downtimeMs = s.downSince ? Date.now() - s.downSince.getTime() : 0;
      s.status = 'UP';
      s.downSince = null;
      s.lastAlertSentAt = null;

      console.log(`[RECOVERED] ${el.name} знову працює! Простій: ${formatDuration(downtimeMs)}`);

      const text = `
✅ <b>ВІДНОВЛЕНО: Роботу елемента відновлено!</b>

🟢 <b>Елемент:</b> ${el.name}
⚪️ <b>Статус:</b> Працює в штатному режимі (${result.message})
⏱ <b>Тривалість простою:</b> ${formatDuration(downtimeMs)}
🕒 <b>Час відновлення:</b> ${formatKyivTime()}
🌐 <b>Сайт:</b> ${SITE_URL}
      `.trim();

      await sendTelegram(text);
    } else {
      s.status = 'UP';
    }
  } else {
    // Помилка
    s.consecutiveFailures += 1;
    s.consecutiveSuccesses = 0;
    s.lastError = result.message;

    console.warn(`[WARN] ${el.name} не відповів (${s.consecutiveFailures}/${FAIL_THRESHOLD}): ${result.message}`);

    // Якщо кількість невдалих спроб досягла порогу
    if (s.consecutiveFailures >= FAIL_THRESHOLD) {
      const now = new Date();

      if (s.status !== 'DOWN') {
        // Перше падіння
        s.status = 'DOWN';
        s.downSince = now;
        s.lastAlertSentAt = now;

        console.error(`🚨 [ALERT] ${el.name} НЕ ПРАЦЮЄ! Помилка: ${result.message}`);

        const text = `
🚨 <b>УВАГА: Збій у роботі сайту Antares!</b>

❌ <b>Недоступний елемент:</b> ${el.name}
🔴 <b>Помилка:</b> <code>${result.message}</code>
⏱ <b>Час виявлення:</b> ${formatKyivTime(now)}
🌐 <b>Сайт:</b> ${SITE_URL}

<i>Бот сповістить вас, коли роботу елемента буде відновлено.</i>
        `.trim();

        await sendTelegram(text);
      } else {
        // Вже був DOWN - чи настав час повторного нагадування?
        const minutesSinceLastAlert = (now.getTime() - s.lastAlertSentAt.getTime()) / (60 * 1000);
        if (minutesSinceLastAlert >= REMINDER_INTERVAL_MIN) {
          s.lastAlertSentAt = now;
          const totalDowntime = now.getTime() - s.downSince.getTime();

          const text = `
⚠️ <b>НАГАДУВАННЯ: Елемент все ще недоступний!</b>

❌ <b>Елемент:</b> ${el.name}
🔴 <b>Помилка:</b> <code>${result.message}</code>
⏱ <b>Загальний час простою:</b> ${formatDuration(totalDowntime)}
🕒 <b>Час перевірки:</b> ${formatKyivTime(now)}
          `.trim();

          await sendTelegram(text);
        }
      }
    }
  }
}

// Повний раунд сканування
async function runCheckCycle() {
  for (const el of elements) {
    try {
      const res = await el.check();
      await handleCheckResult(el, res);
    } catch (err) {
      await handleCheckResult(el, { ok: false, duration: 0, message: err.message || String(err) });
    }
  }
}

// Генерація детального звіту для Telegram (команда /status)
async function generateStatusReport() {
  const rows = [];
  let allHealthy = true;

  for (const el of elements) {
    const s = state.get(el.id);
    let icon = '⚪️';
    let detail = 'Перевіряється...';

    if (s.status === 'UP') {
      icon = '🟢';
      detail = s.lastDurationMs != null ? `${s.lastDurationMs}ms` : 'OK';
    } else if (s.status === 'DOWN') {
      icon = '🔴';
      detail = s.lastError || 'Не відповідає';
      allHealthy = false;
    } else {
      icon = '🟡';
      detail = 'Очікує першої перевірки';
    }

    rows.push(`${icon} <b>${el.name}</b>\n   └ <i>${detail}</i>`);
  }

  const overall = allHealthy
    ? '🟢 <b>Усі 9 елементів сайту працюють штатно!</b>'
    : '⚠️ <b>Увага: виявлено проблеми в системі!</b>';

  return `
📊 <b>Звіт про стан системи Antares:</b>

${rows.join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━
${overall}
🕒 <i>Оновлено: ${formatKyivTime()}</i>
🌐 <i>Сайт: ${SITE_URL}</i>
  `.trim();
}

// Telegram Bot: інтерактивне отримання команд (/status, /test, /help, /start)
let updateOffset = 0;
async function pollTelegramCommands() {
  if (!BOT_TOKEN) return;

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${updateOffset}&timeout=20`;
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const data = await res.json();

    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        updateOffset = update.update_id + 1;
        const msg = update.message;
        if (!msg || !msg.text) continue;

        const text = msg.text.trim();
        const incomingChatId = String(msg.chat.id);
        const fromUser = msg.from?.first_name || 'Адміністратор';

        // Якщо CHAT_ID ще не налаштовано — підказати користувачеві його ID
        if (!CHAT_ID) {
          CHAT_ID = incomingChatId;
          await sendTelegram(
            `👋 Привіт, <b>${fromUser}</b>!\n\n` +
            `Ваш Telegram Chat ID визначено: <code>${incomingChatId}</code>\n\n` +
            `✅ Цей чат автоматично підключено для отримання сповіщень про аварії сайту Antares!\n` +
            `Щоб зафіксувати це назавжди, додайте рядок у <code>.env</code>:\n` +
            `<code>TELEGRAM_CHAT_ID=${incomingChatId}</code>\n\n` +
            `Спробуйте надіслати <b>/status</b> для перевірки всіх систем.`
          );
          continue;
        }

        // Перевірка доступу (тільки авторизований чат)
        if (incomingChatId !== String(CHAT_ID)) {
          console.warn(`[SECURITY] Повідомлення від невідомого чату ID: ${incomingChatId}`);
          continue;
        }

        const cmd = text.toLowerCase().split(' ')[0];

        if (cmd === '/start' || cmd === 'старт') {
          await sendTelegram(
            `👋 Вітаємо в системі моніторингу <b>Antares Watchdog</b>!\n\n` +
            `Я безперервно відстежую стан сайту <b>${SITE_URL}</b> та всіх його компонентів:\n` +
            `• Публічний доступ (Cloudflare)\n` +
            `• Frontend (Nginx/React)\n` +
            `• Backend API\n` +
            `• База даних MySQL\n` +
            `• Кеш Redis\n` +
            `• Модулі новин, галереї та документів\n\n` +
            `У разі будь-якого збою я негайно надішлю вам повідомлення з причиною помилки.\n\n` +
            `Доступні команди:\n` +
            `📊 <b>/status</b> — миттєвий звіт про всі елементи\n` +
            `🔔 <b>/test</b> — тестове сповіщення про аварію і відновлення\n` +
            `❓ <b>/help</b> — довідка`
          );
        } else if (cmd === '/status' || cmd === 'статус' || cmd === '/check') {
          await sendTelegram('⏳ Проводжу повне сканування систем...');
          await runCheckCycle();
          const report = await generateStatusReport();
          await sendTelegram(report);
        } else if (cmd === '/test' || cmd === 'тест') {
          await sendTelegram(
            `🚨 <b>ТЕСТОВЕ СПОВІЩЕННЯ ПРО ЗБІЙ!</b>\n\n` +
            `❌ <b>Недоступний елемент:</b> 🗄 База даних MySQL\n` +
            `🔴 <b>Помилка:</b> <code>Тестова симуляція аварії (Timeout 4000ms)</code>\n` +
            `⏱ <b>Час:</b> ${formatKyivTime()}\n\n` +
            `<i>Це навчальна тривога для перевірки звуку та сповіщень на вашому телефоні. Зараз надійде відновлення...</i>`
          );
          setTimeout(async () => {
            await sendTelegram(
              `✅ <b>ТЕСТОВЕ СПОВІЩЕННЯ ПРО ВІДНОВЛЕННЯ!</b>\n\n` +
              `🟢 <b>Елемент:</b> 🗄 База даних MySQL\n` +
              `⏱ <b>Тривалість простою:</b> 15 сек\n` +
              `🕒 <b>Час відновлення:</b> ${formatKyivTime()}\n\n` +
              `🎉 Усе налаштовано і працює бездоганно!`
            );
          }, 3000);
        } else if (cmd === '/ping' || cmd === 'пінг') {
          await sendTelegram(`🏓 <b>Понг!</b>\nСервіс моніторингу активний. Інтервал перевірки: ${CHECK_INTERVAL_SEC}с.`);
        } else if (cmd === '/help' || cmd === 'допомога') {
          await sendTelegram(
            `📋 <b>Список команд Antares Watchdog:</b>\n\n` +
            `• <b>/status</b> — Перевірити стан усіх сервісів прямо зараз\n` +
            `• <b>/test</b> — Надіслати тестову тривогу на телефон\n` +
            `• <b>/ping</b> — Перевірити чи бот живий\n` +
            `• <b>/help</b> — Посилання на команди`
          );
        }
      }
    }
  } catch (err) {
    // Ігнорувати таймаути під час long-polling
  }

  // Наступний цикл опитування
  setTimeout(pollTelegramCommands, 1000);
}

// Запуск Watchdog
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║       🛡 ANTARES WATCHDOG MONITOR STARTED          ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(`║ 🖥  Середовище:    ${(isDocker ? 'Docker Container' : 'Локальний Host (Mac)').padEnd(31)} ║`);
  console.log(`║ 🌐 Site URL:       ${SITE_URL.padEnd(31)} ║`);
  console.log(`║ 💻 Frontend:        ${FRONTEND_URL.padEnd(31)} ║`);
  console.log(`║ ⚙️  Backend:         ${BACKEND_URL.padEnd(31)} ║`);
  console.log(`║ 🗄  MySQL:           ${`${DB_HOST}:${DB_PORT}`.padEnd(31)} ║`);
  console.log(`║ ⚡️ Redis:           ${`${REDIS_HOST}:${REDIS_PORT}`.padEnd(31)} ║`);
  console.log(`║ ⏱  Check Interval: ${(CHECK_INTERVAL_SEC + 's').padEnd(31)} ║`);
  console.log(`║ 📱 Telegram Bot:   ${(BOT_TOKEN ? 'Налаштовано' : 'ВІДСУТНІЙ (Dry-run)').padEnd(31)} ║`);
  console.log(`║ 💬 Telegram Chat:  ${(CHAT_ID ? CHAT_ID : 'Очікує підключення').padEnd(31)} ║`);
  console.log('╚════════════════════════════════════════════════════╝');

  if (!BOT_TOKEN) {
    console.warn(`
⚠️ УВАГА: TELEGRAM_BOT_TOKEN не задано у файлі .env!
Watchdog працює в режимі виводу в консоль (Dry-run).
Для отримання сповіщень на телефон:
1. Створіть бота в Telegram через @BotFather.
2. Додайте TELEGRAM_BOT_TOKEN та TELEGRAM_CHAT_ID у файл .env.
    `);
  } else {
    // Надіслати привітальне повідомлення при запуску
    await sendTelegram(
      `🛡 <b>Antares Watchdog активовано!</b>\n\n` +
      `Система моніторингу успішно підключена та контролює ${elements.length} елементів сайту.\n` +
      `⏱ Інтервал перевірки: ${CHECK_INTERVAL_SEC} сек.\n` +
      `🌐 Сайт: ${SITE_URL}\n\n` +
      `Надішліть <b>/status</b> у цей чат для швидкої перевірки.`
    );
  }

  // Запуск першого сканування
  await runCheckCycle();

  // Регулярний цикл моніторингу
  setInterval(runCheckCycle, CHECK_INTERVAL_SEC * 1000);

  // Запуск слухача команд Telegram
  pollTelegramCommands();
}

main().catch((err) => {
  console.error('Fatal error in Watchdog:', err);
});
