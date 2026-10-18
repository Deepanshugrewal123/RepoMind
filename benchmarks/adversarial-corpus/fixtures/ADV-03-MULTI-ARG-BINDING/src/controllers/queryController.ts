import { runParameterizedQuery } from '../services/queryService'

// Scenario 1: Arg 0 is safe options, Arg 1 is tainted user query (Must bind to parameter 1!)
export function handleUserSearch(req: any, res: any) {
  const rawSql = req.query.q
  // rawSql is passed as ARGUMENT 1, options as ARGUMENT 0
  runParameterizedQuery({ timeout: 3000 }, rawSql) // Expected: VULNERABLE (True Positive)
}

// Scenario 2: Arg 0 is tainted options, Arg 1 is safe constant query (Parameter 1 is safe!)
export function handleAdminSearch(req: any, res: any) {
  const rawTimeout = req.query.timeout
  const options = { timeout: Number(rawTimeout) || 1000 }
  // Constant string passed as ARGUMENT 1
  runParameterizedQuery(options, "SELECT * FROM status WHERE healthy = true") // Expected: SAFE (True Negative)
}
