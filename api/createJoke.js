import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { jokes } from '../drizzle/schema';

const pool = new Pool({
  connectionString: process.env.COCKROACH_DB_URL,
});

const db = drizzle(pool);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { setup, punchline } = req.body;

    try {
      const result = await db.insert(jokes).values({ setup, punchline }).returning();
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error creating joke:', error);
      res.status(500).json({ error: 'Error creating joke' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}