import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

function getAuthUserFromRequest(req: NextRequest) {
  const token = req.cookies.get('mpcs_auth_token')?.value || req.cookies.get('mpcs_admin_token')?.value;
  if (!token) return null;

  try {
    const parts = token.split('_');
    if (parts.length >= 3 && parts[0] === 'session') {
      const username = decodeURIComponent(parts[1]);
      const role = parts[2];
      return { username, role, isAdmin: role === 'admin' };
    }
  } catch (err) {
    console.error('Error parsing token:', err);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authUser = getAuthUserFromRequest(req);
    const clientId = authUser ? authUser.username : (searchParams.get('clientId') || '');

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

    const commentsByPost: Record<string, typeof comments> = {};
    for (const c of comments) {
      if (!commentsByPost[c.post_id]) {
        commentsByPost[c.post_id] = [];
      }
      commentsByPost[c.post_id].push(c);
    }

    const result = posts.map(p => ({
      id: p.id,
      imageSrc: p.image_src,
      aspectRatio: p.aspect_ratio,
      likesCount: p.likes_count,
      hasLiked: userLikedPostIds.has(p.id),
      comments: commentsByPost[p.id] || []
    }));

    return NextResponse.json({
      success: true,
      posts: result,
      currentUser: authUser
    });
  } catch (error: any) {
    console.error('Error fetching gallery posts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({
        success: false,
        requireLogin: true,
        error: 'Please sign in to react or leave comments'
      }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // Toggle reaction
    if (action === 'react') {
      const { postId } = body;
      const clientId = authUser.username;

      if (!postId) {
        return NextResponse.json({ success: false, error: 'Missing postId' }, { status: 400 });
      }

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

      return NextResponse.json({
        success: true,
        liked,
        likesCount: updated.length > 0 ? updated[0].likes_count : 0
      });
    }

    // Add comment
    if (action === 'comment') {
      const { postId, text } = body;
      const author = authUser.username;

      if (!postId || !text?.trim()) {
        return NextResponse.json({ success: false, error: 'Missing required comment fields' }, { status: 400 });
      }

      const commentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const inserted = await query<{
        id: string;
        post_id: string;
        author: string;
        text: string;
        created_at: string;
      }>(`
        INSERT INTO gallery_comments (id, post_id, author, text)
        VALUES ($1, $2, $3, $4)
        RETURNING id, post_id, author, text, created_at;
      `, [commentId, postId, author, text.trim().slice(0, 500)]);

      return NextResponse.json({ success: true, comment: inserted[0] });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error handling gallery post request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(req);
    if (!authUser || !authUser.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { commentId } = body;

    if (!commentId) {
      return NextResponse.json({ success: false, error: 'Missing commentId' }, { status: 400 });
    }

    await query(`DELETE FROM gallery_comments WHERE id = $1;`, [commentId]);

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
