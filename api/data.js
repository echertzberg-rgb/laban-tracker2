import { neon } from '@neondatabase/serverless'

const EMPTY = { dogs: [], shows: [], goals: [] }

function authorized(req) {
  const required = process.env.APP_PASSWORD
  if (!required) return true
  return req.headers['x-app-password'] === required
}

function validShape(body) {
  return (
    body &&
    typeof body === 'object' &&
    Array.isArray(body.dogs) &&
    Array.isArray(body.shows) &&
    Array.isArray(body.goals)
  )
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (!authorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) {
    return res.status(500).json({ error: 'Database er ikke konfigurert' })
  }

  try {
    const sql = neon(url)
    await sql`CREATE TABLE IF NOT EXISTS laban_data (
      id integer PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM laban_data WHERE id = 1`
      return res.status(200).json(rows[0]?.data ?? EMPTY)
    }

    if (req.method === 'POST') {
      if (!validShape(req.body)) {
        return res.status(400).json({ error: 'Ugyldig data' })
      }
      const { dogs, shows, goals } = req.body
      const json = JSON.stringify({ dogs, shows, goals })
      await sql`INSERT INTO laban_data (id, data) VALUES (1, ${json}::jsonb)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Databasefeil' })
  }
}
