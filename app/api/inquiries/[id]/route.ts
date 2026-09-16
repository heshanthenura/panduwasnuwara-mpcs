import { NextRequest, NextResponse } from 'next/server';
import { updateInquiryStatus, deleteInquiry, getInquiryById } from '@/lib/models/inquiry';

function getAuthFromToken(token?: string) {
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminToken = req.cookies.get('mpcs_admin_token')?.value || req.cookies.get('mpcs_auth_token')?.value;
    const auth = getAuthFromToken(adminToken);

    if (!auth || !auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const inquiryId = parseInt(id, 10);
    if (isNaN(inquiryId)) {
      return NextResponse.json({ success: false, error: 'Invalid inquiry ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status, admin_notes } = body;

    if (!status || !['unread', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const updated = await updateInquiryStatus(inquiryId, status, admin_notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminToken = req.cookies.get('mpcs_admin_token')?.value || req.cookies.get('mpcs_auth_token')?.value;
    const auth = getAuthFromToken(adminToken);

    if (!auth || !auth.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const inquiryId = parseInt(id, 10);
    if (isNaN(inquiryId)) {
      return NextResponse.json({ success: false, error: 'Invalid inquiry ID' }, { status: 400 });
    }

    const deleted = await deleteInquiry(inquiryId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Inquiry not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
