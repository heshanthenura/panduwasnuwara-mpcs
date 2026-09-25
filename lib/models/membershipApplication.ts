import { query } from '@/lib/db';
import { MembershipApplication } from '@/lib/types';
import { initDatabaseSchema } from '@/lib/db/schema';

export interface CreateMembershipApplicationInput {
  user_id?: number | null;
  full_name_si: string;
  full_name_en: string;
  address: string;
  postal_address: string;
  nic: string;
  phone: string;
  email?: string | null;
  certified_form_photo: string;
}

export async function createMembershipApplication(data: CreateMembershipApplicationInput): Promise<MembershipApplication> {
  await initDatabaseSchema();
  const rows = await query<MembershipApplication>(
    `INSERT INTO membership_applications (
      user_id,
      full_name_si,
      full_name_en,
      address,
      postal_address,
      nic,
      phone,
      email,
      certified_form_photo,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
    RETURNING *;`,
    [
      data.user_id || null,
      data.full_name_si.trim(),
      data.full_name_en.trim(),
      data.address.trim(),
      data.postal_address.trim(),
      data.nic.trim().toUpperCase(),
      data.phone.trim(),
      data.email?.trim() || null,
      data.certified_form_photo
    ]
  );
  return rows[0];
}

export async function getMembershipApplications(status?: string): Promise<MembershipApplication[]> {
  await initDatabaseSchema();
  if (status && status !== 'all') {
    return query<MembershipApplication>(
      `SELECT * FROM membership_applications WHERE status = $1 ORDER BY created_at DESC;`,
      [status]
    );
  }
  return query<MembershipApplication>(
    `SELECT * FROM membership_applications ORDER BY created_at DESC;`
  );
}

export async function getMembershipApplicationById(id: number): Promise<MembershipApplication | null> {
  await initDatabaseSchema();
  const rows = await query<MembershipApplication>(
    `SELECT * FROM membership_applications WHERE id = $1;`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function updateMembershipApplicationStatus(
  id: number,
  status: 'pending' | 'approved' | 'rejected',
  adminNotes?: string
): Promise<MembershipApplication | null> {
  await initDatabaseSchema();
  const rows = await query<MembershipApplication>(
    `UPDATE membership_applications
     SET status = $2,
         admin_notes = COALESCE($3, admin_notes),
         updated_at = NOW()
     WHERE id = $1
     RETURNING *;`,
    [id, status, adminNotes || null]
  );
  return rows.length > 0 ? rows[0] : null;
}

export interface UpdateMembershipApplicationInput {
  full_name_si?: string;
  full_name_en?: string;
  address?: string;
  postal_address?: string;
  nic?: string;
  phone?: string;
  email?: string | null;
  certified_form_photo?: string;
  status?: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
}

export async function updateMembershipApplication(
  id: number,
  data: UpdateMembershipApplicationInput
): Promise<MembershipApplication | null> {
  await initDatabaseSchema();
  const current = await getMembershipApplicationById(id);
  if (!current) return null;

  const rows = await query<MembershipApplication>(
    `UPDATE membership_applications
     SET full_name_si = COALESCE($2, full_name_si),
         full_name_en = COALESCE($3, full_name_en),
         address = COALESCE($4, address),
         postal_address = COALESCE($5, postal_address),
         nic = COALESCE($6, nic),
         phone = COALESCE($7, phone),
         email = $8,
         certified_form_photo = COALESCE($9, certified_form_photo),
         status = COALESCE($10, status),
         admin_notes = $11,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *;`,
    [
      id,
      data.full_name_si?.trim() || null,
      data.full_name_en?.trim() || null,
      data.address?.trim() || null,
      data.postal_address?.trim() || null,
      data.nic?.trim()?.toUpperCase() || null,
      data.phone?.trim() || null,
      data.email !== undefined ? (data.email?.trim() || null) : current.email,
      data.certified_form_photo?.trim() || null,
      data.status || null,
      data.admin_notes !== undefined ? (data.admin_notes?.trim() || null) : current.admin_notes
    ]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function deleteMembershipApplication(id: number): Promise<boolean> {
  await initDatabaseSchema();
  await query(
    `DELETE FROM membership_applications WHERE id = $1;`,
    [id]
  );
  return true;
}

