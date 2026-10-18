// ADV-02: Sanitizer Category Mismatch and Verification
import { Client } from 'pg'
import { exec } from 'child_process'
import path from 'path'
import DOMPurify from 'dompurify'
import fs from 'fs'

const db = new Client()

// Scenario 1: path.basename used before SQL sink (path.basename does NOT neutralize SQL injection!)
export function testPathBasenameBeforeSql(req: any) {
  const userTable = req.query.table
  const cleanName = path.basename(userTable) // Strips ../ but not SQL quotes or operators!
  db.query("SELECT * FROM " + cleanName) // Line 14: Vulnerable SQL injection!
}

// Scenario 2: DOMPurify used before Command Injection (DOMPurify does NOT neutralize shell metacharacters!)
export function testDomPurifyBeforeExec(req: any) {
  const script = req.query.script
  const cleanHtml = DOMPurify.sanitize(script) // Sanitizes HTML tags, not shell injection!
  exec("bash -c " + cleanHtml) // Line 21: Vulnerable command injection!
}

// Scenario 3: path.basename used before Path Traversal sink (Proper category match!)
export function testValidCategoryPathBasename(req: any) {
  const userFile = req.query.file
  const safeFile = path.basename(userFile) // Neutralizes directory traversal ../
  fs.readFile(safeFile) // Line 28: Safe path traversal negative test!
}
