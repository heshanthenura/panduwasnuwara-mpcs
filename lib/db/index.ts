import { Pool, PoolClient, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Database queries may fail.');
}

const globalForPg = globalThis as unknown as { pool: Pool | undefined };

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const res = await pool.query<T>(text, params);
  return res.rows;
}

export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}
