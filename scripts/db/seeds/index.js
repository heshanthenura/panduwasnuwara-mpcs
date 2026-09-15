const { seedUsers } = require('./users');
const { seedSettings } = require('./settings');
const { seedGallery } = require('./gallery');
const { seedBusinesses } = require('./businesses');

async function runAllSeeds(client) {
  console.log('Running database seeds...');
  await seedUsers(client);
  await seedSettings(client);
  await seedGallery(client);
  await seedBusinesses(client);
  console.log('✓ Database seeds completed successfully.');
}

module.exports = {
  runAllSeeds,
  seedUsers,
  seedSettings,
  seedGallery,
  seedBusinesses
};
