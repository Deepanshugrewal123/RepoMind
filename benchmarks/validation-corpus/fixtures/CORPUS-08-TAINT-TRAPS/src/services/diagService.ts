import { exec } from 'child_process'

export function runDiagnostics(targetHost: string) {
  // Line 5: Vulnerable OS command execution sink
  exec("ping -c 1 " + targetHost)
}
