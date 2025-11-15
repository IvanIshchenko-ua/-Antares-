const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'admin_panel_db'
});

db.connect(err => {
  if (err) {
    console.error('Помилка при підключенні до MySQL:', err);
    return;
  }
  console.log('Підключено до MySQL');
});

module.exports = db;