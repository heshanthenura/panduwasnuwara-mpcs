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
  membershipApplications: `
    CREATE TABLE IF NOT EXISTS membership_applications (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      full_name_si VARCHAR(255) NOT NULL,
      full_name_en VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      postal_address TEXT NOT NULL,
      nic VARCHAR(50) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      certified_form_photo TEXT NOT NULL,
      status VARCHAR(32) DEFAULT 'pending',
      admin_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
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
  `,
  newsAnnouncements: `
    CREATE TABLE IF NOT EXISTS news_announcements (
      id SERIAL PRIMARY KEY,
      title_si VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      description_si TEXT NOT NULL,
      description_en TEXT NOT NULL,
      image_url TEXT,
      category VARCHAR(64) DEFAULT 'general',
      badge_text_si VARCHAR(100),
      badge_text_en VARCHAR(100),
      is_pinned BOOLEAN DEFAULT false,
      is_published BOOLEAN DEFAULT true,
      published_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  inquiries: `
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      business_key VARCHAR(64) NOT NULL,
      business_name VARCHAR(150) NOT NULL,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      user_name VARCHAR(150) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(32) DEFAULT 'unread',
      reply_message TEXT,
      replied_at TIMESTAMPTZ,
      admin_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  businessServices: `
    CREATE TABLE IF NOT EXISTS business_services (
      id SERIAL PRIMARY KEY,
      business_key VARCHAR(64) NOT NULL,
      title_si VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      desc_si TEXT,
      desc_en TEXT,
      features_si JSONB DEFAULT '[]'::jsonb,
      features_en JSONB DEFAULT '[]'::jsonb,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `,
  fuelPrices: `
    CREATE TABLE IF NOT EXISTS fuel_prices (
      id VARCHAR(32) PRIMARY KEY,
      name_en VARCHAR(100) NOT NULL,
      name_si VARCHAR(100) NOT NULL,
      price_per_liter NUMERIC(10, 2) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `
};

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initDatabaseSchema(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
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
      await query(SCHEMA_DEFINITIONS.newsAnnouncements);
      await query(SCHEMA_DEFINITIONS.inquiries);
      await query(SCHEMA_DEFINITIONS.businessServices);
      await query(SCHEMA_DEFINITIONS.fuelPrices);
      await query(SCHEMA_DEFINITIONS.membershipApplications);

      // 2. Apply incremental schema alterations & seed data
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS nic VARCHAR(50);`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);`);
      await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_nic_unique ON users(LOWER(nic)) WHERE nic IS NOT NULL;`);
      await query(`CREATE INDEX IF NOT EXISTS idx_inquiries_business_key ON inquiries(business_key);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);`);
      await query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS reply_message TEXT;`);
      await query(`ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;`);
      await query(`CREATE INDEX IF NOT EXISTS idx_business_services_key ON business_services(business_key);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_membership_applications_nic ON membership_applications(nic);`);
      await query(`CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON membership_applications(status);`);

      // Seed initial 3 fuel types if not exists
      await query(`
        INSERT INTO fuel_prices (id, name_en, name_si, price_per_liter)
        VALUES 
          ('kerosene', 'Kerosene', 'භූමිතෙල්', 235.00),
          ('petrol-92', 'Petrol 92', 'පෙට්රල් 92', 311.00),
          ('super-diesel', 'Super Diesel', 'සුපර් ඩීසල්', 328.00)
        ON CONFLICT (id) DO NOTHING;
      `);

      isInitialized = true;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

