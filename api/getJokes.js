import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { jokes } from '../drizzle/schema';

const pool = new Pool({
  connectionString: process.env.COCKROACH_DB_URL,
});

const db = drizzle(pool);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await db.select().from(jokes).orderBy(jokes.createdAt.desc()).limit(10);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching jokes:', error);
      res.status(500).json({ error: 'Error fetching jokes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}