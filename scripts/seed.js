const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match) connectionString = match[1];
    }
  } catch {
    // fallback
  }
}

if (!connectionString) {
  console.error("Error: DATABASE_URL not found in environment or .env file.");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

async function main() {
  const client = await pool.connect();

  try {
    console.log("Setting up database schema...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255),
        password TEXT NOT NULL,
        role VARCHAR(32) DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(32) DEFAULT 'admin',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_posts (
        id VARCHAR(64) PRIMARY KEY,
        image_src TEXT NOT NULL,
        aspect_ratio VARCHAR(32) DEFAULT '4:3',
        likes_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_likes (
        id SERIAL PRIMARY KEY,
        post_id VARCHAR(64) REFERENCES gallery_posts(id) ON DELETE CASCADE,
        client_id VARCHAR(128) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(post_id, client_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery_comments (
        id VARCHAR(64) PRIMARY KEY,
        post_id VARCHAR(64) REFERENCES gallery_posts(id) ON DELETE CASCADE,
        author VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Ensure default admin user
    await client.query(`
      INSERT INTO users (username, password, role)
      VALUES ('admin', 'admin123', 'admin')
      ON CONFLICT (username) DO UPDATE SET password = 'admin123', role = 'admin';
    `);

    await client.query(`
      INSERT INTO admin_users (username, password, role)
      VALUES ('admin', 'admin123', 'admin')
      ON CONFLICT (username) DO UPDATE SET password = 'admin123';
    `);

    // Seed default gallery posts if empty
    const { rows: existingPosts } = await client.query(`SELECT COUNT(*)::int as count FROM gallery_posts;`);
    if (existingPosts[0].count === 0) {
      console.log("Seeding initial gallery posts...");
      await client.query(`
        INSERT INTO gallery_posts (id, image_src, aspect_ratio, likes_count, created_at)
        VALUES 
        ('gallery-1', '/images/gallery/coop-annual-meeting.jpg', '4:3', 24, NOW() - INTERVAL '1 day'),
        ('gallery-2', '/images/gallery/coop-community-award.jpg', '4:3', 38, NOW());
      `);

      await client.query(`
        INSERT INTO gallery_comments (id, post_id, author, text, created_at)
        VALUES 
        ('c-1', 'gallery-1', 'Sunil Jayawardena', 'පඬුවස්නුවර සමුපකාර මහා සභා රැස්වීම සහ විශිෂ්ටතා සම්මාන ප්‍රදානය — ඉතාමත් ආඩම්බර මොහොතක්!', NOW() - INTERVAL '12 hours'),
        ('c-2', 'gallery-1', 'Kamani Silva', 'Congratulations to all our committee members and recipients!', NOW() - INTERVAL '6 hours'),
        ('c-3', 'gallery-2', 'Bandara Herath', 'ප්‍රජා සත්කාරක සහ ග්‍රාමීය බැංකු සේවාවන් අගය කිරීම ඉතා වටිනවා.', NOW() - INTERVAL '2 hours');
      `);
    }

    console.log("✓ Database initialized successfully");
  } catch (err) {
    console.error("Database seed error:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
