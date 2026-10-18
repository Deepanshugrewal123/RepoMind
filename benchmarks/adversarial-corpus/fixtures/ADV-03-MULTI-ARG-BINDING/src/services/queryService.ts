import { Client } from 'pg'

const db = new Client()

// Helper with 2 arguments: options at index 0, sqlQuery at index 1
export function runParameterizedQuery(meta: { timeout: number }, sqlQuery: string) {
  // Line 7: Database sink executing sqlQuery
  return db.query(sqlQuery)
}
