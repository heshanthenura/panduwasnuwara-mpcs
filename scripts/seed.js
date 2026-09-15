const { withClient, closePool } = require('./db/client');
const { runMigrations } = require('./db/migrate');
const { runAllSeeds } = require('./db/seeds');

async function main() {
  try {
    await withClient(async (client) => {
      // 1. Ensure schema and incremental migrations are applied
      await runMigrations(client);

      // 2. Run domain seeds
      await runAllSeeds(client);
    });

    console.log('✓ Database setup and seeding completed.');
  } catch (err) {
    console.error('Database setup error:', err);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
