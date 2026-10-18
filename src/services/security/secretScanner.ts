// src/services/security/secretScanner.ts
// Production-grade secret detection and redaction module for RepoMind

import { SecurityFinding } from './types'

export interface SecretSignature {
  id: string
  name: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  confidence: 'HIGH' | 'MEDIUM'
  cwe: string
  regex: RegExp
  formatExcerpt: (match: string, line: string) => { redacted: string; explanation: string }
}

/**
 * Calculates Shannon entropy of a string: H(S) = -sum(p(c) * log2(p(c)))
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0
  const freq: Record<string, number> = {}
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    freq[char] = (freq[char] || 0) + 1
  }

  let entropy = 0
  const len = str.length
  for (const char in freq) {
    const p = freq[char] / len
    entropy -= p * Math.log2(p)
  }
  return entropy
}

/**
 * Redacts a secret value to protect intellectual property and credentials.
 */
export function redactSecretValue(secret: string): string {
  if (!secret) return ''
  if (secret.startsWith('ghp_')) {
    return 'ghp_' + '*'.repeat(Math.min(16, secret.length - 4)) + '[REDACTED]'
  }
  if (secret.startsWith('github_pat_')) {
    return 'github_pat_' + '*'.repeat(16) + '[REDACTED]'
  }
  if (secret.startsWith('AKIA')) {
    return secret.slice(0, 4) + '*'.repeat(12) + '[REDACTED]'
  }
  if (secret.startsWith('sk_live_')) {
    return 'sk_live_' + '*'.repeat(16) + '[REDACTED]'
  }
  if (secret.startsWith('xox')) {
    return secret.slice(0, 5) + '*'.repeat(14) + '[REDACTED]'
  }
  if (secret.startsWith('AIza')) {
    return 'AIza' + '*'.repeat(18) + '[REDACTED]'
  }
  if (secret.length <= 8) {
    return '***[REDACTED]***'
  }
  return secret.slice(0, 2) + '*'.repeat(Math.min(16, secret.length - 4)) + secret.slice(-2) + '[REDACTED]'
}

// Known dummy / placeholder strings that should NOT trigger false positives
const DUMMY_PLACEHOLDERS = new Set([
  'your_secret_here',
  'your_api_key_here',
  'your-api-key',
  'your-secret-key',
  'insert_key_here',
  'change_me',
  'changeme',
  'placeholder',
  'dummy_token',
  'password123',
  'secretpassword',
  '12345678',
  '0123456789abcdef',
  'mysecrettoken',
  'test_token_value',
  'mock_secret_key'
])

function isPlaceholderValue(val: string): boolean {
  const lower = val.toLowerCase().trim()
  if (DUMMY_PLACEHOLDERS.has(lower)) return true
  if (/^x+$/i.test(lower)) return true
  if (/^0+$/i.test(lower)) return true
  if (/^[*]+$/.test(lower)) return true
  if (
    lower.includes('example') ||
    lower.includes('dummy') ||
    lower.includes('placeholder') ||
    lower.includes('sample') ||
    lower.includes('changeme') ||
    lower.includes('replace_') ||
    lower.includes('your_') ||
    lower.includes('insert_')
  ) {
    return true
  }
  return false
}

export const SECRET_SIGNATURES: SecretSignature[] = [
  {
    id: 'RPM-SEC-PRIVKEY-01',
    name: 'Unencrypted Private Key Header',
    severity: 'CRITICAL',
    confidence: 'HIGH',
    cwe: 'CWE-312: Cleartext Storage of Sensitive Information',
    regex: /-----BEGIN\s+(?:RSA|EC|DSA|OPENSSH|PGP)?\s*PRIVATE\s+KEY-----/g,
    formatExcerpt: (_match, line) => ({
      redacted: '-----BEGIN PRIVATE KEY-----\n***[REDACTED PRIVATE KEY MATERIAL]***',
      explanation: 'Unencrypted cryptographic private key detected in source repository. Anyone with read access can sign payloads or decrypt communications.'
    })
  },
  {
    id: 'RPM-SEC-GH-TOKEN-02',
    name: 'GitHub Personal Access Token',
    severity: 'CRITICAL',
    confidence: 'HIGH',
    cwe: 'CWE-798: Use of Hard-coded Credentials',
    regex: /\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})\b/g,
    formatExcerpt: (match, line) => {
      const redactedMatch = redactSecretValue(match)
      return {
        redacted: line.replace(match, redactedMatch).trim(),
        explanation: 'Active GitHub Personal Access Token embedded in source code. Can provide read and write access to repositories, workflows, and organizations.'
      }
    }
  },
  {
    id: 'RPM-SEC-AWS-KEY-03',
    name: 'AWS Access Key Identifier',
    severity: 'CRITICAL',
    confidence: 'HIGH',
    cwe: 'CWE-798: Use of Hard-coded Credentials',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    formatExcerpt: (match, line) => {
      const redactedMatch = redactSecretValue(match)
      return {
        redacted: line.replace(match, redactedMatch).trim(),
        explanation: 'Amazon Web Services (AWS) Access Key ID detected. If accompanied by a secret key, allows unauthenticated API invocations against AWS cloud infrastructure.'
      }
    }
  },
  {
    id: 'RPM-SEC-STRIPE-04',
    name: 'Stripe Live Secret Key',
    severity: 'CRITICAL',
    confidence: 'HIGH',
    cwe: 'CWE-798: Use of Hard-coded Credentials',
    regex: /\b(sk_live_[0-9a-zA-Z]{24,34})\b/g,
    formatExcerpt: (match, line) => {
      const redactedMatch = redactSecretValue(match)
      return {
        redacted: line.replace(match, redactedMatch).trim(),
        explanation: 'Stripe live production secret key detected. Allows unauthorized financial operations, refunds, and customer credit card charge operations.'
      }
    }
  },
  {
    id: 'RPM-SEC-SLACK-05',
    name: 'Slack Bot / App Token',
    severity: 'HIGH',
    confidence: 'HIGH',
    cwe: 'CWE-798: Use of Hard-coded Credentials',
    regex: /\b(xox[baprs]-[0-9a-zA-Z]{10,48})\b/g,
    formatExcerpt: (match, line) => {
      const redactedMatch = redactSecretValue(match)
      return {
        redacted: line.replace(match, redactedMatch).trim(),
        explanation: 'Slack API workspace or bot token detected. Enables unauthorized message reading, webhook interception, and bot impersonation.'
      }
    }
  },
  {
    id: 'RPM-SEC-GOOGLE-06',
    name: 'Google Cloud / Maps API Key',
    severity: 'HIGH',
    confidence: 'MEDIUM',
    cwe: 'CWE-798: Use of Hard-coded Credentials',
    regex: /\b(AIza[0-9A-Za-z-_]{35})\b/g,
    formatExcerpt: (match, line) => {
      const redactedMatch = redactSecretValue(match)
      return {
        redacted: line.replace(match, redactedMatch).trim(),
        explanation: 'Google Cloud Platform / Firebase / Maps API Key detected. May allow unauthorized billable service usage depending on key API restrictions.'
      }
    }
  },
  {
    id: 'RPM-SEC-DB-URI-07',
    name: 'Database URI with Embedded Password',
    severity: 'HIGH',
    confidence: 'HIGH',
    cwe: 'CWE-312: Cleartext Storage of Sensitive Information',
    regex: /(?:postgres|postgresql|mysql|mongodb|redis):\/\/[a-zA-Z0-9_.-]+:([^@\s:/?#]+)@[a-zA-Z0-9_.-]+/g,
    formatExcerpt: (match, line) => {
      const passMatch = match.match(/:\/\/[a-zA-Z0-9_.-]+:([^@\s:/?#]+)@/)
      let redactedLine = line
      if (passMatch && passMatch[1]) {
        redactedLine = line.replace(passMatch[1], '***[REDACTED_PASSWORD]***')
      }
      return {
        redacted: redactedLine.trim(),
        explanation: 'Database connection URI contains cleartext authentication credentials. Exposes database instances to unauthorized access and data exfiltration.'
      }
    }
  }
]

/**
 * Scans a file's content for hardcoded secrets and high-entropy credentials.
 */
export function scanFileForSecrets(
  content: string,
  filePath: string,
  repoRef?: string
): SecurityFinding[] {
  const findings: SecurityFinding[] = []
  if (!content || typeof content !== 'string') return findings

  // Ignore documentation and obvious sample templates from secret alerts
  const lowerPath = filePath.toLowerCase()
  const isSampleFile = lowerPath.includes('.env.example') ||
                       lowerPath.includes('.env.sample') ||
                       lowerPath.endsWith('.md') ||
                       lowerPath.includes('test-fixtures')

  const lines = content.split('\n')

  // 1. Signature-Based Secret Scanning
  for (const sig of SECRET_SIGNATURES) {
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx]
      sig.regex.lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = sig.regex.exec(line)) !== null) {
        const secretVal = match[1] || match[0]
        if (isPlaceholderValue(secretVal)) continue

        const { redacted, explanation } = sig.formatExcerpt(secretVal, line)
        const lineNum = lineIdx + 1

        findings.push({
          id: `SEC-SECR-${findings.length + 1}`,
          ruleId: sig.id,
          ruleName: sig.name,
          category: 'HARDCODED_SECRET',
          severity: sig.severity,
          confidence: isSampleFile ? 'LOW' : sig.confidence,
          repository: repoRef,
          filePath,
          startLine: lineNum,
          endLine: lineNum,
          detectionMethod: 'SECRET_SIGNATURE',
          evidenceExcerpt: redacted,
          explanation,
          preconditionsAndLimitations: isSampleFile
            ? 'Detected in template or documentation file. Verify whether this represents an actual deployed key or documentation dummy.'
            : 'Detected via deterministic token regular expression. Key validity depends on provider revocation status.',
          remediation: 'Immediately revoke and rotate this credential in your provider console. Move secret storage to environment variables, AWS Secrets Manager, or HashiCorp Vault.',
          advisoryReference: sig.cwe,
          timestamp: new Date().toISOString(),
          verificationStatus: isSampleFile ? 'NEEDS_TRIAGE' : 'OBSERVED_SOURCE',
          fingerprint: `${sig.id}:${filePath}:${lineNum}`
        })
      }
    }
  }

  // 2. High-Entropy Assignment Heuristic
  const entropyAssignmentRegex = /(?:password|passwd|api_key|apikey|secret_key|client_secret|auth_token)\s*[:=]\s*['"]([^'"]{16,128})['"]/gi
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx]
    entropyAssignmentRegex.lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = entropyAssignmentRegex.exec(line)) !== null) {
      const candidateValue = match[1]
      if (isPlaceholderValue(candidateValue)) continue

      const entropy = calculateShannonEntropy(candidateValue)
      // High randomness threshold (Shannon entropy >= 3.6 for alphanumeric strings of length >= 16)
      if (entropy >= 3.6) {
        const lineNum = lineIdx + 1
        // Avoid duplicate if already caught by signature
        const alreadyFound = findings.some((f) => f.filePath === filePath && f.startLine === lineNum)
        if (!alreadyFound) {
          const redactedCandidate = redactSecretValue(candidateValue)
          const redactedLine = line.replace(candidateValue, redactedCandidate).trim()

          findings.push({
            id: `SEC-ENTROPY-${findings.length + 1}`,
            ruleId: 'RPM-SEC-ENTROPY-08',
            ruleName: 'High-Entropy Secret Assignment',
            category: 'HARDCODED_SECRET',
            severity: 'HIGH',
            confidence: isSampleFile ? 'LOW' : 'MEDIUM',
            repository: repoRef,
            filePath,
            startLine: lineNum,
            endLine: lineNum,
            detectionMethod: 'ENTROPY_ANALYSIS',
            evidenceExcerpt: redactedLine,
            explanation: `Variable assignment contains candidate secret with high Shannon entropy (${entropy.toFixed(2)} bits/symbol), indicating randomly generated cryptographic or token material.`,
            preconditionsAndLimitations: 'Heuristic detection based on character distribution and variable name. May occasionally flag randomized non-sensitive test strings.',
            remediation: 'Audit this value. If it is an active secret or token, rotate it immediately and inject via environment variables (e.g. process.env.API_KEY).',
            advisoryReference: 'CWE-798: Use of Hard-coded Credentials',
            timestamp: new Date().toISOString(),
            verificationStatus: 'PATTERN_HEURISTIC',
            fingerprint: `RPM-SEC-ENTROPY-08:${filePath}:${lineNum}`
          })
        }
      }
    }
  }

  return findings
}
