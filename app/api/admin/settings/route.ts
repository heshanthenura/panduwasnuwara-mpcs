import { NextRequest, NextResponse } from 'next/server';
import { getRecoveryWhatsAppNumber, setSetting } from '@/lib/models/setting';
import { getYearsOfService, setYearsOfService } from '@/lib/models/stats';

function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get('mpcs_admin_token')?.value || req.cookies.get('mpcs_auth_token')?.value;
  if (!token) return false;
  try {
    const parts = token.split('_');
    return parts.length >= 3 && parts[2] === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const recoveryWhatsAppNumber = await getRecoveryWhatsAppNumber();
    const yearsOfService = await getYearsOfService();
    return NextResponse.json({
      success: true,
      settings: {
        recoveryWhatsAppNumber,
        yearsOfService
      }
    });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { recoveryWhatsAppNumber, yearsOfService } = body;

    if (recoveryWhatsAppNumber !== undefined) {
      // Strip non-digit characters except leading plus
      const cleaned = recoveryWhatsAppNumber.replace(/[^0-9]/g, '');
      await setSetting('recovery_whatsapp_number', cleaned);
    }

    if (yearsOfService !== undefined) {
      await setYearsOfService(yearsOfService);
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
