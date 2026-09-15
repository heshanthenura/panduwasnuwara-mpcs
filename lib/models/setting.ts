import { query } from '@/lib/db';

export async function getSetting(key: string, defaultValue: string = ''): Promise<string> {
  const rows = await query<{ value: string }>(`
    SELECT value FROM settings WHERE key = $1;
  `, [key]);

  return rows.length > 0 ? rows[0].value : defaultValue;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await query(`
    INSERT INTO settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW();
  `, [key, value.trim()]);
}

export async function getRecoveryWhatsAppNumber(): Promise<string> {
  return await getSetting('recovery_whatsapp_number', '94771234567');
}
