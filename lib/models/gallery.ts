import { query } from '@/lib/db';
import { GalleryPost, GalleryComment } from '@/lib/types';

export async function getGalleryPosts(clientId?: string): Promise<GalleryPost[]> {
  const posts = await query<{
    id: string;
    image_src: string;
    aspect_ratio: string;
    likes_count: number;
    created_at: string;
  }>(`
    SELECT id, image_src, aspect_ratio, likes_count, created_at 
    FROM gallery_posts 
    ORDER BY created_at ASC;
  `);

  const comments = await query<{
    id: string;
    post_id: string;
    author: string;
    text: string;
    created_at: string;
  }>(`
    SELECT id, post_id, author, text, created_at 
    FROM gallery_comments 
    ORDER BY created_at ASC;
  `);

  let userLikedPostIds = new Set<string>();
  if (clientId) {
    const userLikes = await query<{ post_id: string }>(`
      SELECT post_id FROM gallery_likes WHERE client_id = $1;
    `, [clientId]);
    userLikedPostIds = new Set(userLikes.map(l => l.post_id));
  }

  const commentsByPost: Record<string, GalleryComment[]> = {};
  for (const c of comments) {
    if (!commentsByPost[c.post_id]) {
      commentsByPost[c.post_id] = [];
    }
    commentsByPost[c.post_id].push(c);
  }

  return posts.map(p => ({
    id: p.id,
    imageSrc: p.image_src,
    aspectRatio: p.aspect_ratio,
    likesCount: p.likes_count,
    hasLiked: userLikedPostIds.has(p.id),
    comments: commentsByPost[p.id] || []
  }));
}

export async function togglePostLike(postId: string, clientId: string): Promise<{ liked: boolean; likesCount: number }> {
  const existing = await query<{ id: number }>(`
    SELECT id FROM gallery_likes WHERE post_id = $1 AND client_id = $2;
  `, [postId, clientId]);

  let liked = false;
  if (existing.length > 0) {
    await query(`DELETE FROM gallery_likes WHERE post_id = $1 AND client_id = $2;`, [postId, clientId]);
    await query(`UPDATE gallery_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1;`, [postId]);
    liked = false;
  } else {
    await query(`INSERT INTO gallery_likes (post_id, client_id) VALUES ($1, $2);`, [postId, clientId]);
    await query(`UPDATE gallery_posts SET likes_count = likes_count + 1 WHERE id = $1;`, [postId]);
    liked = true;
  }

  const updated = await query<{ likes_count: number }>(`
    SELECT likes_count FROM gallery_posts WHERE id = $1;
  `, [postId]);

  return {
    liked,
    likesCount: updated.length > 0 ? updated[0].likes_count : 0
  };
}

export async function addGalleryComment(postId: string, author: string, text: string): Promise<GalleryComment> {
  const commentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const inserted = await query<GalleryComment>(`
    INSERT INTO gallery_comments (id, post_id, author, text)
    VALUES ($1, $2, $3, $4)
    RETURNING id, post_id, author, text, created_at;
  `, [commentId, postId, author, text.trim().slice(0, 500)]);

  return inserted[0];
}

export async function deleteGalleryComment(commentId: string): Promise<boolean> {
  const res = await query(`DELETE FROM gallery_comments WHERE id = $1 RETURNING id;`, [commentId]);
  return res.length > 0;
}

export interface CreateGalleryPostInput {
  id?: string;
  image_src: string;
  aspect_ratio?: string;
}

export async function createGalleryPost(data: CreateGalleryPostInput): Promise<GalleryPost> {
  const postId = data.id || `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const aspectRatio = data.aspect_ratio || '4:3';

  const inserted = await query<{
    id: string;
    image_src: string;
    aspect_ratio: string;
    likes_count: number;
    created_at: string;
  }>(`
    INSERT INTO gallery_posts (id, image_src, aspect_ratio, likes_count)
    VALUES ($1, $2, $3, 0)
    RETURNING id, image_src, aspect_ratio, likes_count, created_at;
  `, [postId, data.image_src, aspectRatio]);

  const p = inserted[0];
  return {
    id: p.id,
    imageSrc: p.image_src,
    aspectRatio: p.aspect_ratio,
    likesCount: p.likes_count,
    hasLiked: false,
    comments: []
  };
}

export interface UpdateGalleryPostInput {
  image_src?: string;
  aspect_ratio?: string;
}

export async function updateGalleryPost(id: string, data: UpdateGalleryPostInput): Promise<GalleryPost | null> {
  const existing = await query<{ id: string }>(`SELECT id FROM gallery_posts WHERE id = $1;`, [id]);
  if (existing.length === 0) return null;

  const updated = await query<{
    id: string;
    image_src: string;
    aspect_ratio: string;
    likes_count: number;
    created_at: string;
  }>(`
    UPDATE gallery_posts
    SET
      image_src = COALESCE($2, image_src),
      aspect_ratio = COALESCE($3, aspect_ratio)
    WHERE id = $1
    RETURNING id, image_src, aspect_ratio, likes_count, created_at;
  `, [id, data.image_src || null, data.aspect_ratio || null]);

  if (updated.length === 0) return null;

  const comments = await query<GalleryComment>(`
    SELECT id, post_id, author, text, created_at
    FROM gallery_comments
    WHERE post_id = $1
    ORDER BY created_at ASC;
  `, [id]);

  const p = updated[0];
  return {
    id: p.id,
    imageSrc: p.image_src,
    aspectRatio: p.aspect_ratio,
    likesCount: p.likes_count,
    hasLiked: false,
    comments
  };
}

export async function deleteGalleryPost(id: string): Promise<boolean> {
  const res = await query(`DELETE FROM gallery_posts WHERE id = $1 RETURNING id;`, [id]);
  return res.length > 0;
}

