import { NextRequest, NextResponse } from 'next/server';
import { importMembers, MemberRecord } from '@/lib/models/stats';
import { initDatabaseSchema } from '@/lib/db/schema';

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

/**
 * Simple robust CSV / TSV text parser
 */
function parseMemberCsv(text: string): MemberRecord[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Inspect first line to check if header exists
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('name') || firstLine.includes('nic') || firstLine.includes('member') || firstLine.includes('phone');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const records: MemberRecord[] = [];

  for (const line of dataLines) {
    // Split by comma or tab or semicolon, taking care of basic quoted fields
    const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length === 0 || !parts.some(Boolean)) continue;

    // Smart field inference
    let memberNumber = '';
    let fullName = '';
    let nic = '';
    let phone = '';

    if (parts.length === 1) {
      fullName = parts[0];
    } else if (parts.length === 2) {
      fullName = parts[0];
      nic = parts[1];
    } else if (parts.length === 3) {
      memberNumber = parts[0];
      fullName = parts[1];
      nic = parts[2];
    } else {
      memberNumber = parts[0];
      fullName = parts[1];
      nic = parts[2];
      phone = parts[3];
    }

    if (fullName) {
      records.push({ memberNumber, fullName, nic, phone });
    }
  }

  return records;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDatabaseSchema();
    const contentType = req.headers.get('content-type') || '';
    let records: MemberRecord[] = [];
    let mode: 'append' | 'replace' = 'append';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      mode = (formData.get('mode') as 'append' | 'replace') || 'append';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const fileText = await file.text();
      records = parseMemberCsv(fileText);
    } else {
      const body = await req.json();
      mode = body.mode || 'append';
      if (Array.isArray(body.records)) {
        records = body.records;
      } else if (typeof body.csvText === 'string') {
        records = parseMemberCsv(body.csvText);
      }
    }

    if (records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid member records found in the provided file. Ensure columns contain member details.'
      }, { status: 400 });
    }

    const totalCount = await importMembers(records, mode);

    return NextResponse.json({
      success: true,
      importedCount: records.length,
      totalCount,
      message: `Successfully imported ${records.length} members.`
    });
  } catch (err) {
    console.error('Error importing members:', err);
    return NextResponse.json({ success: false, error: 'Failed to import members' }, { status: 500 });
  }
}
