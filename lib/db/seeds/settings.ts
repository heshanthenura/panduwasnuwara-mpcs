import { query } from '@/lib/db';

export async function seedSettings(): Promise<void> {
  // Default WhatsApp recovery/support contact number
  await query(`
    INSERT INTO settings (key, value)
    VALUES ('recovery_whatsapp_number', '94771234567')
    ON CONFLICT (key) DO NOTHING;
  `);

  // Default Years of Service
  await query(`
    INSERT INTO settings (key, value)
    VALUES ('years_of_service', '50')
    ON CONFLICT (key) DO NOTHING;
  `);
}
