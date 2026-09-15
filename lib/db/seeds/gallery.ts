import { query } from '@/lib/db';

export async function seedGallery(): Promise<void> {
  const existing = await query<{ count: number }>(`
    SELECT COUNT(*)::int as count FROM gallery_posts;
  `);

  if (existing.length > 0 && existing[0].count === 0) {
    await query(`
      INSERT INTO gallery_posts (id, image_src, aspect_ratio, likes_count, created_at)
      VALUES 
      ('gallery-1', '/images/gallery/coop-annual-meeting.jpg', '4:3', 24, NOW() - INTERVAL '1 day'),
      ('gallery-2', '/images/gallery/coop-community-award.jpg', '4:3', 38, NOW());
    `);

    await query(`
      INSERT INTO gallery_comments (id, post_id, author, text, created_at)
      VALUES 
      ('c-1', 'gallery-1', 'Sunil Jayawardena', 'පඬුවස්නුවර සමුපකාර මහා සභා රැස්වීම සහ විශිෂ්ටතා සම්මාන ප්‍රදානය — ඉතාමත් ආඩම්බර මොහොතක්!', NOW() - INTERVAL '12 hours'),
      ('c-2', 'gallery-1', 'Kamani Silva', 'Congratulations to all our committee members and recipients!', NOW() - INTERVAL '6 hours'),
      ('c-3', 'gallery-2', 'Bandara Herath', 'ප්‍රජා සත්කාරක සහ ග්‍රාමීය බැංකු සේවාවන් අගය කිරීම ඉතා වටිනවා.', NOW() - INTERVAL '2 hours');
    `);
  }
}
