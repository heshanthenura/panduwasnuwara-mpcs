import { query } from '@/lib/db';
import { NewsAnnouncement } from '@/lib/types';

export async function getNewsAnnouncements(publishedOnly: boolean = true): Promise<NewsAnnouncement[]> {
  const sql = publishedOnly
    ? `SELECT * FROM news_announcements WHERE is_published = true ORDER BY is_pinned DESC, published_at DESC, created_at DESC;`
    : `SELECT * FROM news_announcements ORDER BY is_pinned DESC, published_at DESC, created_at DESC;`;

  const rows = await query<NewsAnnouncement>(sql);
  return rows;
}

export async function getNewsById(id: number): Promise<NewsAnnouncement | null> {
  const rows = await query<NewsAnnouncement>(
    `SELECT * FROM news_announcements WHERE id = $1;`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export interface CreateNewsInput {
  title_si: string;
  title_en: string;
  description_si: string;
  description_en: string;
  image_url?: string | null;
  category?: string;
  badge_text_si?: string | null;
  badge_text_en?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  published_at?: string;
}

export async function createNewsAnnouncement(data: CreateNewsInput): Promise<NewsAnnouncement> {
  const rows = await query<NewsAnnouncement>(
    `INSERT INTO news_announcements (
      title_si,
      title_en,
      description_si,
      description_en,
      image_url,
      category,
      badge_text_si,
      badge_text_en,
      is_pinned,
      is_published,
      published_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, NOW()))
    RETURNING *;`,
    [
      data.title_si,
      data.title_en,
      data.description_si,
      data.description_en,
      data.image_url || null,
      data.category || 'general',
      data.badge_text_si || null,
      data.badge_text_en || null,
      Boolean(data.is_pinned),
      data.is_published !== false,
      data.published_at || null
    ]
  );

  return rows[0];
}

export interface UpdateNewsInput {
  title_si?: string;
  title_en?: string;
  description_si?: string;
  description_en?: string;
  image_url?: string | null;
  category?: string;
  badge_text_si?: string | null;
  badge_text_en?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  published_at?: string;
}

export async function updateNewsAnnouncement(id: number, data: UpdateNewsInput): Promise<NewsAnnouncement | null> {
  const existing = await getNewsById(id);
  if (!existing) return null;

  const rows = await query<NewsAnnouncement>(
    `UPDATE news_announcements SET
      title_si = COALESCE($1, title_si),
      title_en = COALESCE($2, title_en),
      description_si = COALESCE($3, description_si),
      description_en = COALESCE($4, description_en),
      image_url = CASE WHEN $5 IS NOT NULL THEN $5 ELSE image_url END,
      category = COALESCE($6, category),
      badge_text_si = CASE WHEN $7 IS NOT NULL THEN $7 ELSE badge_text_si END,
      badge_text_en = CASE WHEN $8 IS NOT NULL THEN $8 ELSE badge_text_en END,
      is_pinned = COALESCE($9, is_pinned),
      is_published = COALESCE($10, is_published),
      published_at = COALESCE($11, published_at),
      updated_at = NOW()
    WHERE id = $12
    RETURNING *;`,
    [
      data.title_si,
      data.title_en,
      data.description_si,
      data.description_en,
      data.image_url !== undefined ? data.image_url : null,
      data.category,
      data.badge_text_si !== undefined ? data.badge_text_si : null,
      data.badge_text_en !== undefined ? data.badge_text_en : null,
      data.is_pinned !== undefined ? data.is_pinned : null,
      data.is_published !== undefined ? data.is_published : null,
      data.published_at || null,
      id
    ]
  );

  return rows.length > 0 ? rows[0] : null;
}

export async function deleteNewsAnnouncement(id: number): Promise<boolean> {
  const res = await query(`DELETE FROM news_announcements WHERE id = $1 RETURNING id;`, [id]);
  return res.length > 0;
}
