// ADV-04: Branch and Control-Flow Ambiguity
import { exec } from 'child_process'

// Scenario 1: Conditional branch assignment
// Expected: Detected path, but verificationStatus must be 'UNRESOLVED_CONTEXT' (not 'CONFIRMED_FLOW')
export function testConditionalTaint(req: any) {
  let host = "127.0.0.1"
  if (req.query.useCustom) {
    host = req.query.customHost
  }
  exec("ping -c 1 " + host) // Line 11: Conditional flow
}

// Scenario 2: Overwrite in both branches with safe constants
// Expected: SAFE (True Negative) - host is unconditionally overwritten with a safe constant literal
export function testBranchOverwrites(req: any) {
  let cmd = req.query.cmd
  if (req.query.dryRun) {
    cmd = "echo dry_run"
  } else {
    cmd = "echo normal_run"
  }
  exec(cmd) // Line 22: Safe constant execution!
}
