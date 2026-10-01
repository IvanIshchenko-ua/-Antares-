/**
 * Скрипт для перевірки надсилання сповіщення у Telegram на телефон
 * Використання:
 *   node monitor/test-telegram.js
 *   або
 *   node monitor/test-telegram.js <BOT_TOKEN> <CHAT_ID>
 */

const fs = require('fs');
const path = require('path');

// Спроба прочитати .env файл з кореня проекту, якщо змінні не передані через процес
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

const token = process.argv[2] || process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.argv[3] || process.env.TELEGRAM_CHAT_ID;

async function run() {
  console.log('🔍 Перевірка налаштувань Telegram...');

  if (!token || !chatId) {
    console.error(`
❌ Помилка: Не вказано TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID!

Будь ласка:
1. Додайте їх у файл .env:
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789

АБО передайте як аргументи:
   node monitor/test-telegram.js <BOT_TOKEN> <CHAT_ID>
    `);
    process.exit(1);
  }

  console.log(`🤖 Bot Token: ${token.slice(0, 10)}... (приховано)`);
  console.log(`📱 Chat ID:   ${chatId}`);
  console.log('📡 Надсилання тестового сповіщення на телефон...');

  const text = `
🔔 <b>Тестове сповіщення Antares Watchdog!</b>

✅ Зв'язок із Telegram-ботом налаштовано успішно!
📱 Push-сповіщення на телефоні працюють.
🛡 Тепер система повідомить вас у разі падіння сайту або будь-якого з його елементів (MySQL, Redis, Frontend, API, тощо).

🕒 <i>Час тесту: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    if (data.ok) {
      console.log('🎉 УСПІХ! Тестове сповіщення успішно надіслано на ваш телефон у Telegram.');
    } else {
      console.error(`❌ Помилка від Telegram API: ${data.description}`);
      if (data.description && data.description.includes('chat not found')) {
        console.error('👉 Підказка: Ви повинні спочатку зайти у створеного бота в Telegram і натиснути кнопку /start !');
      }
    }
  } catch (err) {
    console.error('❌ Мережева помилка при підключенні до Telegram:', err.message);
  }
}

run();
