import { query } from '@/lib/db';

export const SCHEMA_DEFINITIONS = {
  users: `
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
  `,
  adminUsers: `
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(32) DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  galleryPosts: `
    CREATE TABLE IF NOT EXISTS gallery_posts (
      id VARCHAR(64) PRIMARY KEY,
      image_src TEXT NOT NULL,
      aspect_ratio VARCHAR(32) DEFAULT '4:3',
      likes_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  galleryLikes: `
    CREATE TABLE IF NOT EXISTS gallery_likes (
      id SERIAL PRIMARY KEY,
      post_id VARCHAR(64) REFERENCES gallery_posts(id) ON DELETE CASCADE,
      client_id VARCHAR(128) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(post_id, client_id)
    );
  `,
  galleryComments: `
    CREATE TABLE IF NOT EXISTS gallery_comments (
      id VARCHAR(64) PRIMARY KEY,
      post_id VARCHAR(64) REFERENCES gallery_posts(id) ON DELETE CASCADE,
      author VARCHAR(100) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  settings: `
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(64) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
};

export async function initDatabaseSchema(): Promise<void> {
  // 1. Create base tables
  await query(SCHEMA_DEFINITIONS.users);
  await query(SCHEMA_DEFINITIONS.adminUsers);
  await query(SCHEMA_DEFINITIONS.galleryPosts);
  await query(SCHEMA_DEFINITIONS.galleryLikes);
  await query(SCHEMA_DEFINITIONS.galleryComments);
  await query(SCHEMA_DEFINITIONS.settings);

  // 2. Apply incremental schema alterations
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS nic VARCHAR(50);`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);`);
  await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_nic_unique ON users(LOWER(nic)) WHERE nic IS NOT NULL;`);
}
