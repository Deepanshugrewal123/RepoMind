import { Client } from 'pg'

const db = new Client({
  connectionString: process.env.DATABASE_URL
})

export function queryDatabase(query: string) {
  // Line 10: Vulnerable database execution sink
  return db.query(query)
}
