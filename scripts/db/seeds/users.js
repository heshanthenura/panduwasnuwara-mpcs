async function seedUsers(client) {
  console.log('Seeding default administrator accounts...');

  await client.query(`
    INSERT INTO users (username, full_name, nic, phone, password, role)
    VALUES ('admin', 'System Administrator', 'ADMIN', '0770000000', 'admin123', 'admin')
    ON CONFLICT (username) DO UPDATE 
    SET password = 'admin123', role = 'admin',
        full_name = COALESCE(users.full_name, 'System Administrator'),
        nic = COALESCE(users.nic, 'ADMIN');
  `);

  await client.query(`
    INSERT INTO admin_users (username, password, role)
    VALUES ('admin', 'admin123', 'admin')
    ON CONFLICT (username) DO UPDATE SET password = 'admin123';
  `);
}

module.exports = { seedUsers };
