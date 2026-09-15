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
  `,
  importedMembers: `
    CREATE TABLE IF NOT EXISTS imported_members (
      id SERIAL PRIMARY KEY,
      member_number VARCHAR(100),
      full_name VARCHAR(255) NOT NULL,
      nic VARCHAR(50),
      phone VARCHAR(50),
      imported_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  eligibleVoters: `
    CREATE TABLE IF NOT EXISTS eligible_voters (
      id SERIAL PRIMARY KEY,
      voter_number VARCHAR(100),
      full_name VARCHAR(255) NOT NULL,
      nic VARCHAR(50),
      division VARCHAR(100),
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  businesses: `
    CREATE TABLE IF NOT EXISTS businesses (
      id SERIAL PRIMARY KEY,
      key VARCHAR(64) UNIQUE NOT NULL,
      title_si VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      manager VARCHAR(150),
      hotline VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
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
  await query(SCHEMA_DEFINITIONS.importedMembers);
  await query(SCHEMA_DEFINITIONS.eligibleVoters);
  await query(SCHEMA_DEFINITIONS.businesses);

  // 2. Apply incremental schema alterations
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS nic VARCHAR(50);`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);`);
  await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_nic_unique ON users(LOWER(nic)) WHERE nic IS NOT NULL;`);
}
