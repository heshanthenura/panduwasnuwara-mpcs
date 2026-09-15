import { NextRequest, NextResponse } from 'next/server';
import { uploadEligibleVoters, VoterRecord } from '@/lib/models/stats';
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
 * Robust Electoral Register CSV parser
 */
function parseVoterCsv(text: string): VoterRecord[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('voter') || firstLine.includes('name') || firstLine.includes('nic') || firstLine.includes('division');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const records: VoterRecord[] = [];

  for (const line of dataLines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length === 0 || !parts.some(Boolean)) continue;

    let voterNumber = '';
    let fullName = '';
    let nic = '';
    let division = '';

    if (parts.length === 1) {
      fullName = parts[0];
    } else if (parts.length === 2) {
      fullName = parts[0];
      nic = parts[1];
    } else if (parts.length === 3) {
      voterNumber = parts[0];
      fullName = parts[1];
      nic = parts[2];
    } else {
      voterNumber = parts[0];
      fullName = parts[1];
      nic = parts[2];
      division = parts[3];
    }

    if (fullName) {
      records.push({ voterNumber, fullName, nic, division });
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
    let records: VoterRecord[] = [];
    let mode: 'append' | 'replace' = 'append';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      mode = (formData.get('mode') as 'append' | 'replace') || 'append';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const fileText = await file.text();
      records = parseVoterCsv(fileText);
    } else {
      const body = await req.json();
      mode = body.mode || 'append';
      if (Array.isArray(body.records)) {
        records = body.records;
      } else if (typeof body.csvText === 'string') {
        records = parseVoterCsv(body.csvText);
      }
    }

    if (records.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid voter records found in the uploaded electoral register.'
      }, { status: 400 });
    }

    const totalCount = await uploadEligibleVoters(records, mode);

    return NextResponse.json({
      success: true,
      uploadedCount: records.length,
      totalCount,
      message: `Successfully processed ${records.length} eligible voters.`
    });
  } catch (err) {
    console.error('Error uploading electoral register:', err);
    return NextResponse.json({ success: false, error: 'Failed to upload electoral register' }, { status: 500 });
  }
}
