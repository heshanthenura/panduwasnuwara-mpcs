import { query } from '@/lib/db';

export async function seedSettings(): Promise<void> {
  // Default WhatsApp recovery/support contact number
  await query(`
    INSERT INTO settings (key, value)
    VALUES ('recovery_whatsapp_number', '94771234567')
    ON CONFLICT (key) DO NOTHING;
  `);
}
