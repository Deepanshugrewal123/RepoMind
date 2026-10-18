import { Client } from 'pg'
import { formatStatement } from './helper'

const db = new Client()

// Scenario 1: Safe call to helper with constant literal arguments
export function runSafeQuery() {
  const safeSql = formatStatement("SELECT * FROM users", "fixed_user")
  db.query(safeSql) // Line 9: Expected: SAFE (True Negative)
}

// Scenario 2: Tainted call to helper with req.query.name argument
export function runTaintedQuery(req: any) {
  const taintedSql = formatStatement("SELECT * FROM users", req.query.name)
  db.query(taintedSql) // Line 15: Expected: VULNERABLE (True Positive)
}
