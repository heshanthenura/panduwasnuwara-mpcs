const { withClient, closePool } = require('./db/client');
const { runMigrations } = require('./db/migrate');

async function main() {
  try {
    await withClient(async (client) => {
      await runMigrations(client);
    });
    console.log('Database migration finished.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await closePool();
  }
}

main();
