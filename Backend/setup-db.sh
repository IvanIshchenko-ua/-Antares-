#!/bin/bash

# Database Setup Script for -Antares-
# This script creates the database and all required tables

MYSQL_USER=${MYSQL_USER:-root}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-""}
MYSQL_HOST=${MYSQL_HOST:-localhost}
DB_NAME=${DB_NAME:-admin_panel_db}

echo "🔧 Setting up database: $DB_NAME"

if [ -z "$MYSQL_PASSWORD" ]; then
  mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" << EOF
else
  mysql -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" << EOF
fi

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'teacher') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  author_id INT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unique news views per browser or authenticated user
CREATE TABLE IF NOT EXISTS news_views (
  news_id INT NOT NULL,
  visitor_key VARCHAR(191) NOT NULL,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (news_id, visitor_key),
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Content table (for pages)
CREATE TABLE IF NOT EXISTS content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  body LONGTEXT NOT NULL,
  author_id INT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transparency (about school info) table
CREATE TABLE IF NOT EXISTS transparency (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(100),
  file_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_news_author ON news(author_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_content_slug ON content(slug);

-- Sample admin user (password: admin123)
INSERT IGNORE INTO users (username, email, password, role) VALUES 
('admin', 'admin@school.com', '$2a$10$...' , 'admin');

-- Note: The password hash above is a placeholder. To add a real admin:
-- 1. Use bcrypt to hash: bcryptjs.hash('your_password', 10)
-- 2. Replace the hash in the INSERT statement

SHOW TABLES;
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = DATABASE();

EOF

if [ $? -eq 0 ]; then
  echo "✅ Database setup completed successfully!"
  echo "📋 Database: $DB_NAME"
  echo "👤 Default admin user: admin@school.com"
else
  echo "❌ Error setting up database"
  exit 1
fi
