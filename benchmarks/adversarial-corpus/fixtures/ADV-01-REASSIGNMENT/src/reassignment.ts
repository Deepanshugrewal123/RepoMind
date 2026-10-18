// ADV-01: Reassignment and Scope Collisions
import { Client } from 'pg'
import { exec } from 'child_process'
import fs from 'fs'

const db = new Client()

// Scenario 1: Taint-to-Safe Overwrite (Should be SAFE / True Negative)
export function testTaintToSafeOverwrite(req: any) {
  let query = req.query.id
  query = "SELECT * FROM users WHERE active = 1" // Overwritten with constant literal!
  db.query(query) // Line 12: Safe!
}

// Scenario 2: Safe-to-Taint Overwrite (Should be VULNERABLE / True Positive)
export function testSafeToTaintOverwrite(req: any) {
  let cmd = "echo safe_constant"
  cmd = req.query.cmd // Overwritten with untrusted input!
  exec(cmd) // Line 19: Vulnerable command injection!
}

// Scenario 3: Identically named local variables across separate function scopes
export function handleA(req: any) {
  const x = req.query.data
  return x
}

export function handleB() {
  const x = "safe_report.txt" // Safe constant
  fs.readFile(x) // Line 30: Safe file read (should NOT be flagged by handleA's x)
}
