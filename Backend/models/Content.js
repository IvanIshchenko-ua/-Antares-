const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'admin_panel_db'
});

const Content = {
  getContent: (page_name, callback) => {
    console.log('DB Query: Getting content for', page_name);
    db.query('SELECT * FROM content WHERE page_name = ?', [page_name], callback);
  },

  saveContent: (page_name, content, callback) => {
    console.log('DB Query: Saving content for', page_name);
    db.query('INSERT INTO content (page_name, content) VALUES (?, ?)', [page_name, content], callback);
  },

  updateContent: (page_name, content, callback) => {
    console.log('DB Query: Updating content for', page_name);
    db.query('UPDATE content SET content = ? WHERE page_name = ?', [content, page_name], callback);
  },
};

module.exports = Content;