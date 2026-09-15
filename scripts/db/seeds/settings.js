async function seedSettings(client) {
  console.log('Seeding default system settings...');

  await client.query(`
    INSERT INTO settings (key, value)
    VALUES ('recovery_whatsapp_number', '94771234567')
    ON CONFLICT (key) DO NOTHING;
  `);
}

module.exports = { seedSettings };
