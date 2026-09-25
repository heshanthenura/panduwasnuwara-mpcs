import { query } from '@/lib/db';
import { getSetting, setSetting } from './setting';

export interface LiveStats {
  membersCount: number;
  votersCount: number;
  businessesCount: number;
  yearsOfService: number;
  updatedAt: string;
}

export interface MemberRecord {
  memberNumber?: string;
  fullName: string;
  nic?: string;
  phone?: string;
}

export interface VoterRecord {
  voterNumber?: string;
  fullName: string;
  nic?: string;
  division?: string;
}

export interface BusinessRecord {
  id?: number;
  key: string;
  titleSi: string;
  titleEn: string;
  manager?: string;
  hotline?: string;
  isActive?: boolean;
}

/**
 * Retrieve aggregated real-time statistics for the frontend counter
 */
export async function getLiveStats(): Promise<LiveStats> {
  // 1. Members count: count from imported_members
  const membersRes = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM imported_members;
  `);
  let membersCount = parseInt(membersRes[0]?.count || '0', 10);

  // If no imported members yet, fall back to registered users count as initial baseline
  if (membersCount === 0) {
    const usersRes = await query<{ count: string }>(`
      SELECT COUNT(*)::text AS count FROM users WHERE role = 'user';
    `);
    membersCount = parseInt(usersRes[0]?.count || '0', 10);
  }

  // 2. Eligible voters count from eligible_voters
  const votersRes = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM eligible_voters;
  `);
  const votersCount = parseInt(votersRes[0]?.count || '0', 10);

  // 3. Registered businesses count
  const businessesRes = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM businesses WHERE is_active = true;
  `);
  let businessesCount = parseInt(businessesRes[0]?.count || '0', 10);
  if (businessesCount === 0) {
    businessesCount = 10; // 10 core cooperative divisions
  }

  // 4. Years of service from settings
  const yearsSetting = await getSetting('years_of_service', '50');
  const yearsOfService = parseInt(yearsSetting, 10) || 50;

  return {
    membersCount,
    votersCount,
    businessesCount,
    yearsOfService,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Import members from CSV / parsed tabular records
 */
export async function importMembers(
  records: MemberRecord[],
  mode: 'append' | 'replace' = 'append'
): Promise<number> {
  if (mode === 'replace') {
    await query(`TRUNCATE TABLE imported_members RESTART IDENTITY;`);
  }

  for (const r of records) {
    if (!r.fullName || !r.fullName.trim()) continue;
    await query(`
      INSERT INTO imported_members (member_number, full_name, nic, phone, imported_at)
      VALUES ($1, $2, $3, $4, NOW());
    `, [
      r.memberNumber?.trim() || null,
      r.fullName.trim(),
      r.nic?.trim().toUpperCase() || null,
      r.phone?.trim() || null
    ]);
  }

  const res = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM imported_members;
  `);
  return parseInt(res[0]?.count || '0', 10);
}

/**
 * Upload verified voters from electoral register file
 */
export async function uploadEligibleVoters(
  records: VoterRecord[],
  mode: 'append' | 'replace' = 'append'
): Promise<number> {
  if (mode === 'replace') {
    await query(`TRUNCATE TABLE eligible_voters RESTART IDENTITY;`);
  }

  for (const r of records) {
    if (!r.fullName || !r.fullName.trim()) continue;
    await query(`
      INSERT INTO eligible_voters (voter_number, full_name, nic, division, uploaded_at)
      VALUES ($1, $2, $3, $4, NOW());
    `, [
      r.voterNumber?.trim() || null,
      r.fullName.trim(),
      r.nic?.trim().toUpperCase() || null,
      r.division?.trim() || null
    ]);
  }

  const res = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM eligible_voters;
  `);
  return parseInt(res[0]?.count || '0', 10);
}

/**
 * Query imported members with optional search query and pagination
 */
export async function getImportedMembersList(
  search?: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ members: any[]; total: number }> {
  const sanitizedLimit = Math.min(Math.max(limit, 1), 100);
  const sanitizedOffset = Math.max(offset, 0);

  if (search && search.trim()) {
    const q = `%${search.trim()}%`;
    const countRes = await query<{ count: string }>(`
      SELECT COUNT(*)::text AS count FROM imported_members
      WHERE full_name ILIKE $1 OR nic ILIKE $1 OR member_number ILIKE $1;
    `, [q]);
    const total = parseInt(countRes[0]?.count || '0', 10);

    const rows = await query(`
      SELECT id, member_number, full_name, nic, phone, imported_at
      FROM imported_members
      WHERE full_name ILIKE $1 OR nic ILIKE $1 OR member_number ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3;
    `, [q, sanitizedLimit, sanitizedOffset]);

    return { members: rows, total };
  }

  const countRes = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM imported_members;
  `);
  const total = parseInt(countRes[0]?.count || '0', 10);

  const rows = await query(`
    SELECT id, member_number, full_name, nic, phone, imported_at
    FROM imported_members
    ORDER BY id ASC
    LIMIT $1 OFFSET $2;
  `, [sanitizedLimit, sanitizedOffset]);

  return { members: rows, total };
}

/**
 * Query eligible voters with optional search query and pagination
 */
export async function getEligibleVotersList(
  search?: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ voters: any[]; total: number }> {
  const sanitizedLimit = Math.min(Math.max(limit, 1), 100);
  const sanitizedOffset = Math.max(offset, 0);

  if (search && search.trim()) {
    const q = `%${search.trim()}%`;
    const countRes = await query<{ count: string }>(`
      SELECT COUNT(*)::text AS count FROM eligible_voters
      WHERE full_name ILIKE $1 OR nic ILIKE $1 OR voter_number ILIKE $1 OR division ILIKE $1;
    `, [q]);
    const total = parseInt(countRes[0]?.count || '0', 10);

    const rows = await query(`
      SELECT id, voter_number, full_name, nic, division, uploaded_at
      FROM eligible_voters
      WHERE full_name ILIKE $1 OR nic ILIKE $1 OR voter_number ILIKE $1 OR division ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3;
    `, [q, sanitizedLimit, sanitizedOffset]);

    return { voters: rows, total };
  }

  const countRes = await query<{ count: string }>(`
    SELECT COUNT(*)::text AS count FROM eligible_voters;
  `);
  const total = parseInt(countRes[0]?.count || '0', 10);

  const rows = await query(`
    SELECT id, voter_number, full_name, nic, division, uploaded_at
    FROM eligible_voters
    ORDER BY id ASC
    LIMIT $1 OFFSET $2;
  `, [sanitizedLimit, sanitizedOffset]);

  return { voters: rows, total };
}

/**
 * Years of service configuration
 */
export async function getYearsOfService(): Promise<number> {
  const val = await getSetting('years_of_service', '50');
  return parseInt(val, 10) || 50;
}

export async function setYearsOfService(years: number | string): Promise<void> {
  const sanitized = String(parseInt(String(years), 10) || 50);
  await setSetting('years_of_service', sanitized);
}

/**
 * Businesses management
 */
export async function getAllBusinesses(): Promise<BusinessRecord[]> {
  const rows = await query<{
    id: number;
    key: string;
    title_si: string;
    title_en: string;
    manager: string | null;
    hotline: string | null;
    is_active: boolean;
  }>(`
    SELECT id, key, title_si, title_en, manager, hotline, is_active
    FROM businesses
    ORDER BY id ASC;
  `);

  return rows.map(r => ({
    id: r.id,
    key: r.key,
    titleSi: r.title_si,
    titleEn: r.title_en,
    manager: r.manager || undefined,
    hotline: r.hotline || undefined,
    isActive: r.is_active
  }));
}
