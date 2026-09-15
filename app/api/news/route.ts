import { NextResponse } from 'next/server';
import { getNewsAnnouncements } from '@/lib/models/news';
import { initDatabaseSchema } from '@/lib/db/schema';

export async function GET() {
  try {
    await initDatabaseSchema();
    const news = await getNewsAnnouncements(true);
    return NextResponse.json({
      success: true,
      news
    });
  } catch (err) {
    console.error('Failed to fetch news announcements:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}
