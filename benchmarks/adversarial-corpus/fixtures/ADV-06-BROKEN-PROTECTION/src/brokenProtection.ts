// ADV-06: Broken Parameterization Traps
import { Client } from 'pg'

const db = new Client()

// Scenario 1: Empty parameter array trap
// The query contains string concatenation of tainted user input, but passes an empty array []
// A naive regex checking for ', [' will falsely think this is safe!
export function testEmptyArrayTrap(req: any) {
  const user = req.query.user
  db.query("SELECT * FROM accounts WHERE user = '" + user + "'", []) // Line 11: Vulnerable SQL injection!
}

// Scenario 2: $1 placeholder in literal without passing parameter array
export function testMissingArrayTrap(req: any) {
  const user = req.query.user
  db.query("SELECT * FROM accounts WHERE id = $1 AND role = '" + user + "'") // Line 17: Vulnerable SQL injection!
}

// Scenario 3: Valid parameterized query (Protected / True Negative)
export function testValidParameterized(req: any) {
  const user = req.query.user
  db.query("SELECT * FROM accounts WHERE user = $1", [user]) // Line 23: Safe parameterized query!
}
