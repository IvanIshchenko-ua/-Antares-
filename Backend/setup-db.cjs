const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'admin_panel_db',
};

const SQL_QUERIES = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin', 'teacher') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // News table
  `CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    author_id INT NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'draft',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Unique news views per browser or authenticated user
  `CREATE TABLE IF NOT EXISTS news_views (
    news_id INT NOT NULL,
    visitor_key VARCHAR(191) NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (news_id, visitor_key),
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Gallery table
  `CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Content table
  `CREATE TABLE IF NOT EXISTS content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    body LONGTEXT NOT NULL,
    author_id INT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Transparency table
  `CREATE TABLE IF NOT EXISTS transparency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    category VARCHAR(100),
    file_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Create indexes
  `ALTER TABLE users ADD INDEX IF NOT EXISTS idx_users_email (email);`,
  `ALTER TABLE news ADD INDEX IF NOT EXISTS idx_news_author (author_id);`,
  `ALTER TABLE news ADD INDEX IF NOT EXISTS idx_news_status (status);`,
  `ALTER TABLE gallery ADD INDEX IF NOT EXISTS idx_gallery_category (category);`,
  `ALTER TABLE content ADD INDEX IF NOT EXISTS idx_content_slug (slug);`,
];

async function setupDatabase() {
  let connection;

  try {
    console.log('🔧 Connecting to MySQL...');

    // First, connect without database to create it
    connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
    });

    console.log(`✅ Connected to MySQL server`);

    // Create database
    console.log(`📦 Creating database '${config.database}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    console.log(`✅ Database created/verified`);

    // Close first connection and reconnect to the database
    await connection.end();

    // Reconnect to the specific database
    connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    });

    console.log(`✅ Selected database '${config.database}'`);

    // Create tables
    console.log(`📋 Creating tables...`);
    for (const query of SQL_QUERIES) {
      try {
        await connection.query(query);
      } catch (error) {
        console.warn(`⚠️ Warning: ${error.message}`);
      }
    }
    console.log(`✅ All tables created/verified`);

    // Verify tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📊 Database tables created:`);
    tables.forEach((row) => {
      const tableName = Object.values(row)[0];
      console.log(`   ✓ ${tableName}`);
    });

    console.log(`\n✅ Database setup completed successfully!`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Update your .env file with correct MySQL credentials`);
    console.log(`   2. Run: npm run dev`);
    console.log(`   3. Test API: curl http://localhost:5000/health`);

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
