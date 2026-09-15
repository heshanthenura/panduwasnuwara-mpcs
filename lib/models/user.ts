import { query } from '@/lib/db';
import { User } from '@/lib/types';

export async function findUserByNicOrUsername(identifier: string): Promise<User | null> {
  const clean = identifier.trim();
  const rows = await query<User>(`
    SELECT id, username, full_name, nic, phone, email, password, role, created_at
    FROM users
    WHERE LOWER(nic) = LOWER($1) 
       OR LOWER(username) = LOWER($1)
       OR (phone IS NOT NULL AND phone = $1);
  `, [clean]);

  if (rows.length > 0) return rows[0];

  // Fallback check for admin
  interface AdminRow {
    id: number;
    username: string;
    password: string;
    role: string;
    created_at: string;
  }
  const adminRows = await query<AdminRow>(`
    SELECT id, username, password, role, created_at
    FROM admin_users
    WHERE LOWER(username) = LOWER($1);
  `, [clean]);

  if (adminRows.length > 0) {
    const admin = adminRows[0];
    return {
      id: admin.id,
      username: admin.username,
      full_name: 'Administrator',
      nic: 'ADMIN',
      phone: '',
      password: admin.password,
      role: 'admin',
      created_at: admin.created_at
    };
  }

  return null;
}

export async function findUserById(id: number): Promise<User | null> {
  const rows = await query<User>(`
    SELECT id, username, full_name, nic, phone, email, role, created_at
    FROM users
    WHERE id = $1;
  `, [id]);
  return rows[0] || null;
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  return await query<Omit<User, 'password'>>(`
    SELECT id, username, full_name, nic, phone, email, role, created_at
    FROM users
    ORDER BY created_at DESC;
  `);
}

export async function createUser(params: {
  fullName: string;
  nic: string;
  phone: string;
  password: string;
  email?: string;
}): Promise<User> {
  const cleanNic = params.nic.trim();
  const cleanName = params.fullName.trim();
  const cleanPhone = params.phone.trim();
  const username = cleanNic.toLowerCase();

  const rows = await query<User>(`
    INSERT INTO users (username, full_name, nic, phone, email, password, role)
    VALUES ($1, $2, $3, $4, $5, $6, 'user')
    RETURNING id, username, full_name, nic, phone, email, role, created_at;
  `, [username, cleanName, cleanNic, cleanPhone, params.email?.trim() || null, params.password]);

  return rows[0];
}

export async function updateUser(
  id: number,
  params: {
    fullName?: string;
    nic?: string;
    phone?: string;
    role?: 'user' | 'admin';
    password?: string;
  }
): Promise<User | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (params.fullName !== undefined) {
    fields.push(`full_name = $${idx++}`);
    values.push(params.fullName.trim());
  }
  if (params.nic !== undefined) {
    fields.push(`nic = $${idx++}`);
    values.push(params.nic.trim());
    fields.push(`username = $${idx++}`);
    values.push(params.nic.trim().toLowerCase());
  }
  if (params.phone !== undefined) {
    fields.push(`phone = $${idx++}`);
    values.push(params.phone.trim());
  }
  if (params.role !== undefined) {
    fields.push(`role = $${idx++}`);
    values.push(params.role);
  }
  if (params.password && params.password.trim().length > 0) {
    fields.push(`password = $${idx++}`);
    values.push(params.password.trim());
  }

  if (fields.length === 0) return await findUserById(id);

  values.push(id);
  const rows = await query<User>(`
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING id, username, full_name, nic, phone, email, role, created_at;
  `, values);

  return rows[0] || null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const res = await query(`DELETE FROM users WHERE id = $1 RETURNING id;`, [id]);
  return res.length > 0;
}
