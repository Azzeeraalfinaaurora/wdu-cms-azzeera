import { Client } from 'pg';

const DEFAULT_DB = 'postgres';
const TARGET_DB = 'wdu_cms_db';

async function initDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'azzeera2207',
    database: DEFAULT_DB,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [TARGET_DB]
    );

    if (result.rows.length === 0) {
      console.log(`Creating database "${TARGET_DB}"...`);
      await client.query(`CREATE DATABASE ${TARGET_DB}`);
      console.log(`Database "${TARGET_DB}" created successfully!`);
    } else {
      console.log(`Database "${TARGET_DB}" already exists.`);
    }
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log(`Database "${TARGET_DB}" already exists.`);
    } else {
      console.error('Error creating database:', error.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

initDatabase();