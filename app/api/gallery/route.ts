import { NextRequest, NextResponse } from 'next/server';
import {
  getGalleryPosts,
  togglePostLike,
  addGalleryComment,
  deleteGalleryComment
} from '@/lib/models/gallery';

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

    const posts = await getGalleryPosts(clientId);

    return NextResponse.json({
      success: true,
      posts,
      currentUser: authUser
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching gallery posts:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
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

      const result = await togglePostLike(postId, clientId);
      return NextResponse.json({
        success: true,
        liked: result.liked,
        likesCount: result.likesCount
      });
    }

    // Add comment
    if (action === 'comment') {
      const { postId, text } = body;
      const author = authUser.username;

      if (!postId || !text?.trim()) {
        return NextResponse.json({ success: false, error: 'Missing required comment fields' }, { status: 400 });
      }

      const comment = await addGalleryComment(postId, author, text);
      return NextResponse.json({ success: true, comment });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling gallery post request:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
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

    const success = await deleteGalleryComment(commentId);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting comment:', error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
