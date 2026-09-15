async function runMigrations(client) {
  console.log('Running database migrations...');

  // Users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      full_name VARCHAR(150),
      nic VARCHAR(50) UNIQUE,
      phone VARCHAR(50),
      email VARCHAR(255),
      password TEXT NOT NULL,
      role VARCHAR(32) DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Incremental user schema alterations
  await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);`);
  await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS nic VARCHAR(50);`);
  await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
  await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);`);
  await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS users_nic_unique ON users(LOWER(nic)) WHERE nic IS NOT NULL;`);

  // Admin users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(32) DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Gallery posts table
  await client.query(`
    CREATE TABLE IF NOT EXISTS gallery_posts (
      id VARCHAR(64) PRIMARY KEY,
      image_src TEXT NOT NULL,
      aspect_ratio VARCHAR(32) DEFAULT '4:3',
      likes_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Gallery likes table
  await client.query(`
    CREATE TABLE IF NOT EXISTS gallery_likes (
      id SERIAL PRIMARY KEY,
      post_id VARCHAR(64) REFERENCES gallery_posts(id) ON DELETE CASCADE,
      client_id VARCHAR(128) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(post_id, client_id)
    );
  `);

  // Gallery comments table
  await client.query(`
    CREATE TABLE IF NOT EXISTS gallery_comments (
      id VARCHAR(64) PRIMARY KEY,
      post_id VARCHAR(64) REFERENCES gallery_posts(id) ON DELETE CASCADE,
      author VARCHAR(100) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // System settings table
  await client.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(64) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('✓ Database migrations completed.');
}

module.exports = { runMigrations };
