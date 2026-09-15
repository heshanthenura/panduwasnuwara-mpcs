import { NextResponse } from 'next/server';
import { getLiveStats } from '@/lib/models/stats';
import { initDatabaseSchema } from '@/lib/db/schema';
import { seedBusinesses } from '@/lib/db/seeds/businesses';
import { seedSettings } from '@/lib/db/seeds/settings';

let schemaInitialized = false;

async function ensureSchema() {
  if (!schemaInitialized) {
    try {
      await initDatabaseSchema();
      await seedSettings();
      await seedBusinesses();
      schemaInitialized = true;
    } catch (err) {
      console.error('Schema initialization error:', err);
    }
  }
}

export async function GET() {
  try {
    await ensureSchema();
    const stats = await getLiveStats();
    return NextResponse.json({
      success: true,
      stats
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (err) {
    console.error('Error fetching live stats:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live stats' },
      { status: 500 }
    );
  }
}
