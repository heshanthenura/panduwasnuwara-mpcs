import { query } from '@/lib/db';
import { Inquiry } from '@/lib/types';
import { initDatabaseSchema } from '@/lib/db/schema';

export interface CreateInquiryInput {
  business_key: string;
  business_name: string;
  user_id?: number | null;
  user_name: string;
  phone: string;
  email?: string | null;
  subject: string;
  message: string;
}

export async function createInquiry(data: CreateInquiryInput): Promise<Inquiry> {
  await initDatabaseSchema();
  const rows = await query<Inquiry>(
    `INSERT INTO inquiries (
      business_key,
      business_name,
      user_id,
      user_name,
      phone,
      email,
      subject,
      message,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'unread')
    RETURNING *;`,
    [
      data.business_key,
      data.business_name,
      data.user_id || null,
      data.user_name,
      data.phone,
      data.email || null,
      data.subject,
      data.message
    ]
  );
  return rows[0];
}

export async function getInquiries(businessKey?: string, status?: string): Promise<Inquiry[]> {
  await initDatabaseSchema();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (businessKey && businessKey !== 'all') {
    params.push(businessKey);
    conditions.push(`business_key = $${params.length}`);
  }

  if (status && status !== 'all') {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM inquiries ${whereClause} ORDER BY created_at DESC;`;

  return query<Inquiry>(sql, params);
}

export async function getInquiryById(id: number): Promise<Inquiry | null> {
  await initDatabaseSchema();
  const rows = await query<Inquiry>(
    `SELECT * FROM inquiries WHERE id = $1;`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export interface UpdateInquiryInput {
  status?: 'unread' | 'read' | 'replied';
  admin_notes?: string | null;
  reply_message?: string | null;
  replied_at?: string | null;
}

export async function updateInquiry(
  id: number,
  input: UpdateInquiryInput
): Promise<Inquiry | null> {
  await initDatabaseSchema();
  const current = await getInquiryById(id);
  if (!current) return null;

  const newStatus = input.status !== undefined ? input.status : current.status;
  const newNotes = input.admin_notes !== undefined ? input.admin_notes : current.admin_notes;
  const newReply = input.reply_message !== undefined ? input.reply_message : current.reply_message;
  let newRepliedAt = input.replied_at !== undefined ? input.replied_at : current.replied_at;

  if (newStatus === 'replied' && !newRepliedAt) {
    newRepliedAt = new Date().toISOString();
  }

  const rows = await query<Inquiry>(
    `UPDATE inquiries
     SET status = $2,
         admin_notes = $3,
         reply_message = $4,
         replied_at = $5,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *;`,
    [id, newStatus, newNotes, newReply, newRepliedAt]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function updateInquiryStatus(
  id: number,
  status: 'unread' | 'read' | 'replied',
  adminNotes?: string
): Promise<Inquiry | null> {
  return updateInquiry(id, {
    status,
    admin_notes: adminNotes !== undefined ? adminNotes : undefined
  });
}

export async function deleteInquiry(id: number): Promise<boolean> {
  await initDatabaseSchema();
  const rows = await query(
    `DELETE FROM inquiries WHERE id = $1 RETURNING id;`,
    [id]
  );
  return rows.length > 0;
}

export async function getInquiryCategoryCounts(): Promise<{ business_key: string; count: number; unread_count: number }[]> {
  await initDatabaseSchema();
  const rows = await query<{ business_key: string; count: string; unread_count: string }>(
    `SELECT 
       business_key, 
       COUNT(*) as count,
       COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_count
     FROM inquiries 
     GROUP BY business_key;`
  );
  return rows.map(r => ({
    business_key: r.business_key,
    count: parseInt(r.count, 10) || 0,
    unread_count: parseInt(r.unread_count, 10) || 0
  }));
}
