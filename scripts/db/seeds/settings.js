async function seedSettings(client) {
  console.log('Seeding default system settings...');

  // Default WhatsApp recovery/support contact number
  await client.query(`
    INSERT INTO settings (key, value)
    VALUES ('recovery_whatsapp_number', '94771234567')
    ON CONFLICT (key) DO NOTHING;
  `);

  // Default Years of Service
  await client.query(`
    INSERT INTO settings (key, value)
    VALUES ('years_of_service', '50')
    ON CONFLICT (key) DO NOTHING;
  `);
}

module.exports = { seedSettings };
