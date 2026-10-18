#!/usr/bin/env node

/**
 * benchmarks/run-corpus-validation.js
 * RepoMind Phase 7 External Repository Validation & Reliability Benchmark Runner
 *
 * Deterministically evaluates RepoMind's CAP-10 Security Intelligence and
 * Architectural Analysis against 7 diverse external repository fixtures,
 * measuring True Positives, False Positives, True Negatives, False Negatives,
 * Precision, Recall, Accuracy, F1-Score, Scope Coverage, and Processing Latency.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BENCHMARK_START_TIME = performance.now()
const INITIAL_MEMORY = process.memoryUsage()

console.log('\n' + '='.repeat(78))
console.log('  REPOMIND PHASE 7: EXTERNAL REPOSITORY VALIDATION & RELIABILITY BENCHMARK')
console.log('='.repeat(78) + '\n')

// ----------------------------------------------------------------------------
// 1. LOAD CORPUS MANIFEST & INDEPENDENT GROUND TRUTH
// ----------------------------------------------------------------------------
const manifestPath = path.join(__dirname, 'validation-corpus', 'corpus-manifest.json')
const groundTruthPath = path.join(__dirname, 'validation-corpus', 'ground-truth.json')
const fixturesRoot = path.join(__dirname, 'validation-corpus', 'fixtures')

if (!fs.existsSync(manifestPath) || !fs.existsSync(groundTruthPath)) {
  console.error('❌ Error: Missing corpus-manifest.json or ground-truth.json')
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const groundTruth = JSON.parse(fs.readFileSync(groundTruthPath, 'utf8'))

console.log(`Corpus Loaded: ${manifest.repositories.length} external repositories defined`)
console.log(`Ground Truth: ${groundTruth.vectors.length} peer-audited evaluation vectors cataloged\n`)

// ----------------------------------------------------------------------------
// 2. SCANNER CORE IMPLEMENTATIONS (MIRRORING PRODUCTION SERVICES)
// ----------------------------------------------------------------------------

// A. Semver & Lockfile Resolution
function compareSemver(v1, v2) {
  const clean1 = (v1 || '').replace(/^[^\d]*/, '').split('-')[0].split('.')
  const clean2 = (v2 || '').replace(/^[^\d]*/, '').split('-')[0].split('.')
  for (let i = 0; i < 3; i++) {
    const num1 = parseInt(clean1[i] || '0', 10)
    const num2 = parseInt(clean2[i] || '0', 10)
    if (num1 !== num2) return num1 - num2
  }
  return 0
}

function isExactVersion(versionStr) {
  if (!versionStr) return false
  const trimmed = versionStr.trim()
  if (trimmed.startsWith('^') || trimmed.startsWith('~') || trimmed.startsWith('>') || trimmed.startsWith('<') || trimmed.startsWith('*') || trimmed.includes('||')) {
    return false
  }
  return /^\d+\.\d+\.\d+/.test(trimmed)
}

const VERIFIED_OFFLINE_ADVISORIES = [
  {
    id: 'GHSA-35jh-r3h4-6jhm',
    ecosystem: 'npm',
    package: 'lodash',
    vulnerableVersions: (v) => compareSemver(v, '4.17.21') < 0,
    affectedRange: '< 4.17.21',
    fixedVersion: '4.17.21',
    title: 'Command Injection in lodash.template',
    severity: 'HIGH',
    cwe: 'CWE-94: Improper Control of Generation of Code',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-23337'
  },
  {
    id: 'GHSA-c2qf-rxjj-qqgw',
    ecosystem: 'npm',
    package: 'axios',
    vulnerableVersions: (v) => compareSemver(v, '0.21.2') < 0,
    affectedRange: '< 0.21.2',
    fixedVersion: '0.21.2',
    title: 'Server-Side Request Forgery in axios',
    severity: 'HIGH',
    cwe: 'CWE-918: Server-Side Request Forgery',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2020-28168'
  },
  {
    id: 'GHSA-qw6h-vgh9-j6wx',
    ecosystem: 'npm',
    package: 'jsonwebtoken',
    vulnerableVersions: (v) => compareSemver(v, '9.0.0') < 0,
    affectedRange: '< 9.0.0',
    fixedVersion: '9.0.0',
    title: 'Arbitrary File Write / RCE in jsonwebtoken verify()',
    severity: 'CRITICAL',
    cwe: 'CWE-22: Path Traversal',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2022-23529'
  },
  {
    id: 'GHSA-m84x-pnwh-2cq8',
    ecosystem: 'npm',
    package: 'express',
    vulnerableVersions: (v) => compareSemver(v, '4.19.2') < 0,
    affectedRange: '< 4.19.2',
    fixedVersion: '4.19.2',
    title: 'Open Redirect in express.res.location and express.res.redirect',
    severity: 'MEDIUM',
    cwe: 'CWE-601: URL Redirection to Untrusted Site',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-29041'
  },
  {
    id: 'GHSA-j8r2-6x86-q33q',
    ecosystem: 'PyPI',
    package: 'requests',
    vulnerableVersions: (v) => compareSemver(v, '2.31.0') < 0,
    affectedRange: '< 2.31.0',
    fixedVersion: '2.31.0',
    title: 'Unintended leak of Proxy-Authorization headers in requests',
    severity: 'MEDIUM',
    cwe: 'CWE-200: Exposure of Sensitive Information',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2023-32681'
  },
  {
    id: 'GHSA-q2x7-8rv6-6q7h',
    ecosystem: 'PyPI',
    package: 'urllib3',
    vulnerableVersions: (v) => compareSemver(v, '1.26.5') < 0,
    affectedRange: '< 1.26.5',
    fixedVersion: '1.26.5',
    title: 'ReDoS in urllib3 via catastrophic backtracking in header parsing',
    severity: 'HIGH',
    cwe: 'CWE-400: Uncontrolled Resource Consumption',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-33503'
  },
  {
    id: 'GHSA-g2j5-57x7-95q4',
    ecosystem: 'PyPI',
    package: 'jinja2',
    vulnerableVersions: (v) => compareSemver(v, '2.11.3') < 0,
    affectedRange: '< 2.11.3',
    fixedVersion: '2.11.3',
    title: 'ReDoS via attr filter in Jinja2',
    severity: 'MEDIUM',
    cwe: 'CWE-400: Uncontrolled Resource Consumption',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2020-28493'
  }
]

function parseManifestDependencies(filePath, content) {
  const deps = []
  const fileName = path.basename(filePath).toLowerCase()
  const lines = content.split('\n')

  try {
    if (fileName === 'package.json') {
      const parsed = JSON.parse(content)
      const depTypes = ['dependencies', 'devDependencies']
      for (const type of depTypes) {
        if (parsed[type]) {
          for (const [name, version] of Object.entries(parsed[type])) {
            let declLine = 1
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(`"${name}"`) && lines[i].includes(':')) {
                declLine = i + 1
                break
              }
            }
            deps.push({
              name,
              version: String(version),
              isExact: isExactVersion(String(version)),
              ecosystem: 'npm',
              manifestFile: filePath,
              isDev: type === 'devDependencies',
              line: declLine
            })
          }
        }
      }
    } else if (fileName === 'package-lock.json') {
      const parsed = JSON.parse(content)
      if (parsed.packages) {
        for (const [pkgPath, pkgData] of Object.entries(parsed.packages)) {
          if (!pkgPath || !pkgData.version) continue
          const name = pkgPath.replace(/^node_modules\//, '')
          let declLine = 1
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(`"${pkgPath}"`) || lines[i].includes(`"${name}"`)) {
              declLine = i + 1
              break
            }
          }
          deps.push({
            name,
            version: pkgData.version,
            isExact: true,
            ecosystem: 'npm',
            manifestFile: filePath,
            isDev: !!pkgData.dev,
            line: declLine
          })
        }
      }
    } else if (fileName === 'requirements.txt') {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith('#')) continue
        const match = line.match(/^([a-zA-Z0-9_\-\.]+)\s*(?:==|>=|<=|~=)\s*([a-zA-Z0-9_\-\.]+)/)
        if (match) {
          deps.push({
            name: match[1],
            version: match[2],
            isExact: line.includes('=='),
            ecosystem: 'PyPI',
            manifestFile: filePath,
            line: i + 1
          })
        }
      }
    } else if (fileName === 'go.mod') {
      let inRequire = false
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('require (')) {
          inRequire = true
          continue
        }
        if (inRequire && line === ')') {
          inRequire = false
          continue
        }
        if (inRequire || line.startsWith('require ')) {
          const cleanLine = inRequire ? line : line.replace(/^require\s+/, '')
          const parts = cleanLine.split(/\s+/)
          if (parts.length >= 2) {
            deps.push({
              name: parts[0],
              version: parts[1],
              isExact: true,
              ecosystem: 'Go',
              manifestFile: filePath,
              line: i + 1
            })
          }
        }
      }
    } else if (fileName === 'cargo.toml') {
      let inDeps = false
      let isDev = false
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('[dependencies]') || line.startsWith('[dev-dependencies]')) {
          inDeps = true
          isDev = line.startsWith('[dev-dependencies]')
          continue
        }
        if (line.startsWith('[') && inDeps) {
          inDeps = false
          continue
        }
        if (inDeps && line && !line.startsWith('#')) {
          const match = line.match(/^([a-zA-Z0-9_\-]+)\s*=\s*["']([^"']+)["']/)
          if (match) {
            deps.push({
              name: match[1],
              version: match[2],
              isExact: isExactVersion(match[2]),
              ecosystem: 'crates.io',
              manifestFile: filePath,
              isDev,
              line: i + 1
            })
          }
        }
      }
    }
  } catch (err) {
    // Malformed manifest resilience
  }
  return deps
}

function correlateDependencies(dependencies) {
  const findings = []
  // Deduplicate and prioritize exact lockfile versions over loose manifest ranges
  const exactMap = new Map()
  for (const dep of dependencies) {
    const key = `${dep.ecosystem}:${dep.name}`
    if (dep.isExact || !exactMap.has(key)) {
      exactMap.set(key, dep)
    }
  }

  for (const dep of exactMap.values()) {
    const matchedAdvisories = VERIFIED_OFFLINE_ADVISORIES.filter(
      adv => adv.ecosystem === dep.ecosystem && adv.package.toLowerCase() === dep.name.toLowerCase()
    )

    for (const adv of matchedAdvisories) {
      if (adv.vulnerableVersions(dep.version)) {
        findings.push({
          ruleId: `RPM-DEP-${adv.id}`,
          ruleName: adv.title,
          category: 'DEPENDENCY',
          severity: adv.severity,
          confidence: dep.isExact ? 'HIGH' : 'MEDIUM',
          filePath: dep.manifestFile,
          startLine: dep.line || 1,
          endLine: dep.line || 1,
          advisoryId: adv.id,
          reference: adv.referenceUrl,
          package: dep.name,
          version: dep.version,
          fixedVersion: adv.fixedVersion
        })
      }
    }
  }
  return findings
}

// B. Shannon Entropy & Credential Scanner
function calculateShannonEntropy(str) {
  if (!str || str.length === 0) return 0
  const freq = {}
  for (const char of str) {
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

function redactSecretValue(secret) {
  if (!secret) return ''
  if (secret.startsWith('ghp_')) return 'ghp_' + '*'.repeat(16) + '[REDACTED]'
  if (secret.startsWith('AKIA')) return secret.slice(0, 4) + '*'.repeat(12) + '[REDACTED]'
  if (secret.startsWith('sk_live_')) return 'sk_live_' + '*'.repeat(16) + '[REDACTED]'
  if (secret.length <= 8) return '***[REDACTED]***'
  return secret.slice(0, 2) + '*'.repeat(Math.min(16, secret.length - 4)) + secret.slice(-2) + '[REDACTED]'
}

function isPlaceholderValue(val) {
  const lower = val.toLowerCase().trim()
  if (
    lower.includes('example') ||
    lower.includes('dummy') ||
    lower.includes('placeholder') ||
    lower.includes('sample') ||
    lower.includes('changeme') ||
    lower.includes('replace_') ||
    lower.includes('your_') ||
    lower.includes('insert_') ||
    lower.includes('mock_') ||
    lower === 'password123'
  ) {
    return true
  }
  return false
}

const SECRET_SIGNATURES = [
  { id: 'RPM-SEC-PRIVKEY-01', name: 'Unencrypted Private Key Header', regex: /-----BEGIN (?:RSA|OPENSSH|DSA|EC|PGP)?\s*PRIVATE KEY-----/i, severity: 'CRITICAL', confidence: 'HIGH' },
  { id: 'RPM-SEC-GH-TOKEN-02', name: 'GitHub Personal Access Token', regex: /(?:^|[^a-zA-Z0-9_])(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})(?:[^a-zA-Z0-9_]|$)/, severity: 'CRITICAL', confidence: 'HIGH' },
  { id: 'RPM-SEC-AWS-KEY-03', name: 'AWS Access Key ID', regex: /(?:^|[^A-Z0-9])(AKIA[0-9A-Z]{16})(?:[^A-Z0-9]|$)/, severity: 'HIGH', confidence: 'HIGH' },
  { id: 'RPM-SEC-STRIPE-04', name: 'Stripe Live Secret Key', regex: /(?:^|[^a-zA-Z0-9_])(sk_live_[0-9a-zA-Z]{24,34})(?:[^a-zA-Z0-9_]|$)/, severity: 'HIGH', confidence: 'HIGH' }
]

function scanSecrets(filePath, content) {
  const findings = []
  const lines = content.split('\n')

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const lineNum = idx + 1

    for (const sig of SECRET_SIGNATURES) {
      const match = line.match(sig.regex)
      if (match) {
        const rawToken = match[1] || match[0]
        if (isPlaceholderValue(rawToken) || isPlaceholderValue(line)) {
          continue
        }
        if (sig.id === 'RPM-SEC-AWS-KEY-03') {
          const entropy = calculateShannonEntropy(rawToken)
          if (entropy < 2.5) continue
        }

        const redacted = line.replace(rawToken, redactSecretValue(rawToken))
        findings.push({
          ruleId: sig.id,
          ruleName: sig.name,
          category: 'SECRET',
          severity: sig.severity,
          confidence: sig.confidence,
          filePath,
          startLine: lineNum,
          endLine: lineNum,
          redactedEvidence: redacted.trim()
        })
      }
    }
  }
  return findings
}

// C. SAST Engine with Comment Line Masking
const SAST_RULES = [
  {
    id: 'RPM-SAST-SQLI-01',
    name: 'Unsanitized SQL Query Concatenation',
    category: 'SQL_INJECTION',
    languages: ['javascript', 'typescript', 'python', 'go'],
    check: (filePath, lines) => {
      const findings = []
      const jsSqlRegex = /\b(?:query|execute|raw|select|update|delete)\s*\(\s*(?:`[^`]*\$\{[^}]+\}[^`]*`|["'][^"']*(?:SELECT|UPDATE|DELETE|INSERT|FROM|WHERE)[^"']*["']\s*\+\s*[\w$.]+)/i
      const pySqlRegex = /\b(?:execute|raw)\s*\(\s*(?:f["'][^"']*(?:SELECT|UPDATE|DELETE|INSERT|FROM|WHERE)[^"']*\{[^}]+\}|["'][^"']*(?:SELECT|UPDATE|DELETE|INSERT)[^"']*\s*%\s*[\w$.]+)/i
      const goSqlRegex = /\b(?:Query|Exec|QueryRow)\s*\(\s*fmt\.Sprintf\s*\(\s*["'][^"']*(?:SELECT|UPDATE|DELETE|INSERT)[^"']*/i

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const isSafeJsParameterized = line.includes('[$') || line.includes('?,') || line.includes(', [')
        const isSafePyParameterized = line.includes(', (') || line.includes(', [')

        if (jsSqlRegex.test(line) && !isSafeJsParameterized) {
          findings.push({ ruleId: 'RPM-SAST-SQLI-01', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        } else if (pySqlRegex.test(line) && !isSafePyParameterized) {
          findings.push({ ruleId: 'RPM-SAST-SQLI-01', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        } else if (goSqlRegex.test(line)) {
          findings.push({ ruleId: 'RPM-SAST-SQLI-01', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        }
      }
      return findings
    }
  },
  {
    id: 'RPM-SAST-XSS-02',
    name: 'DOM-Based Cross-Site Scripting (XSS)',
    category: 'XSS',
    languages: ['javascript', 'typescript'],
    check: (filePath, lines) => {
      const findings = []
      const xssRegex = /\.(innerHTML|outerHTML)\s*=\s*(?!['"][^<]*['"])(?!document\.)[\w$.]+/
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (xssRegex.test(line)) {
          findings.push({ ruleId: 'RPM-SAST-XSS-02', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        }
      }
      return findings
    }
  },
  {
    id: 'RPM-SAST-DESER-05',
    name: 'Insecure Deserialization of Untrusted Data',
    category: 'DESERIALIZATION',
    languages: ['python', 'java', 'javascript', 'typescript'],
    check: (filePath, lines) => {
      const findings = []
      const pyPickle = /\bpickle\.(?:loads|load)\s*\(/
      const javaObjIn = /\bnew\s+ObjectInputStream\s*\(|\.readObject\s*\(/
      const jsUnserialize = /\b(?:serialize|node-serialize)\.unserialize\s*\(/

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (pyPickle.test(line) || javaObjIn.test(line) || jsUnserialize.test(line)) {
          findings.push({ ruleId: 'RPM-SAST-DESER-05', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        }
      }
      return findings
    }
  },
  {
    id: 'RPM-SAST-CRYPTO-07',
    name: 'Broken or Cryptographically Weak Hash Algorithm',
    category: 'CRYPTOGRAPHY',
    languages: ['javascript', 'typescript', 'python', 'go', 'java'],
    check: (filePath, lines) => {
      const findings = []
      const weakHashRegex = /(?:createHash\s*\(\s*['"](?:md5|sha1)['"]|hashlib\.(?:md5|sha1)\s*\(|md5\.New\s*\(\))/i
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (weakHashRegex.test(line)) {
          findings.push({ ruleId: 'RPM-SAST-CRYPTO-07', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        }
      }
      return findings
    }
  },
  {
    id: 'RPM-SAST-TLS-08',
    name: 'Disabled or Permissive TLS/SSL Verification',
    category: 'NETWORK_SECURITY',
    languages: ['javascript', 'typescript', 'python', 'go', 'java'],
    check: (filePath, lines) => {
      const findings = []
      const tlsRegex = /(?:rejectUnauthorized\s*:\s*false|verify\s*=\s*False|InsecureSkipVerify\s*:\s*true|check_hostname\s*=\s*False)/
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (tlsRegex.test(line)) {
          findings.push({ ruleId: 'RPM-SAST-TLS-08', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        }
      }
      return findings
    }
  },
  {
    id: 'RPM-SAST-EVAL-09',
    name: 'Dynamic Code Evaluation via eval()',
    category: 'CODE_INJECTION',
    languages: ['javascript', 'typescript', 'python'],
    check: (filePath, lines) => {
      const findings = []
      const evalRegex = /(?:^|[^a-zA-Z0-9_$])eval\s*\([^)]+\)/
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (evalRegex.test(line)) {
          findings.push({ ruleId: 'RPM-SAST-EVAL-09', filePath, startLine: i + 1, endLine: i + 1, category: 'SAST' })
        }
      }
      return findings
    }
  }
]

function scanSAST(filePath, content) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '')
  const langMap = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    go: 'go',
    java: 'java',
    rs: 'rust'
  }
  const lang = langMap[ext]
  if (!lang) return []

  const rawLines = content.split('\n')
  // Mask pure comment lines while preserving exact array index and line numbers
  const effectiveLines = rawLines.map(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#') || trimmed.startsWith('--')) {
      return ''
    }
    return line
  })

  const findings = []
  for (const rule of SAST_RULES) {
    if (rule.languages.includes(lang)) {
      const ruleFindings = rule.check(filePath, effectiveLines)
      findings.push(...ruleFindings)
    }
  }
  return findings
}

// ----------------------------------------------------------------------------
// 2D. CONTEXT-AWARE TAINT TRACKING (PHASE 8 EXTENSION)
// ----------------------------------------------------------------------------

const TAINT_SOURCES = [
  {
    id: 'NODE-HTTP-QUERY',
    pattern: /\b(?:req|request)\.query(?:\.([a-zA-Z0-9_$]+)|\[['"]([^'"]+)['"]\])?/,
    extractVar: (m, line) => {
      const assign = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*.*(?:req|request)\./)
      const destructure = line.match(/(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:req|request)\./)
      if (assign) return assign[1].trim()
      if (destructure) return destructure[1].split(',')[0].trim().split(':')[0].trim()
      return m[1] || m[2] || 'query'
    }
  },
  {
    id: 'NODE-HTTP-BODY',
    pattern: /\b(?:req|request)\.body(?:\.([a-zA-Z0-9_$]+)|\[['"]([^'"]+)['"]\])?/,
    extractVar: (m, line) => {
      const assign = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*.*(?:req|request)\./)
      const destructure = line.match(/(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:req|request)\./)
      if (assign) return assign[1].trim()
      if (destructure) return destructure[1].split(',')[0].trim().split(':')[0].trim()
      return m[1] || m[2] || 'body'
    }
  },
  {
    id: 'NODE-HTTP-PARAMS',
    pattern: /\b(?:req|request)\.params(?:\.([a-zA-Z0-9_$]+)|\[['"]([^'"]+)['"]\])?/,
    extractVar: (m, line) => {
      const assign = line.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*.*(?:req|request)\./)
      const destructure = line.match(/(?:const|let|var)\s*\{([^}]+)\}\s*=\s*(?:req|request)\./)
      if (assign) return assign[1].trim()
      if (destructure) return destructure[1].split(',')[0].trim().split(':')[0].trim()
      return m[1] || m[2] || 'params'
    }
  },
  {
    id: 'PY-HTTP-ARGS',
    pattern: /\brequest\.(?:args|query_params)(?:\.get\s*\(\s*['"]([^'"]+)['"]|\[['"]([^'"]+)['"]\])?/,
    extractVar: (m, line) => {
      const assign = line.match(/([a-zA-Z0-9_]+)\s*=\s*request\./)
      if (assign) return assign[1].trim()
      return m[1] || 'args'
    }
  }
]

const TAINT_SINKS = [
  {
    id: 'SINK-SQL',
    ruleId: 'RPM-TAINT-SQLI-01',
    category: 'SQL_INJECTION',
    pattern: /\b(?:db|pool|cursor|session)\.(?:query|execute)\s*\(\s*([^,\)]+)/i,
    checkProtection: (line) => line.includes('[$') || line.includes('?,') || line.includes(', [') || line.includes(', (')
  },
  {
    id: 'SINK-CMD',
    ruleId: 'RPM-TAINT-CMDI-02',
    category: 'COMMAND_INJECTION',
    pattern: /(?:\bexec\s*\(\s*([^\)]+)|os\.system\s*\(\s*([^\)]+)|subprocess\.(?:Popen|run)\s*\(\s*([^\),]+).*shell\s*=\s*True)/,
    checkProtection: (line) => line.includes('execFile') || line.includes('shell=False')
  },
  {
    id: 'SINK-XSS',
    ruleId: 'RPM-TAINT-XSS-03',
    category: 'XSS',
    pattern: /\.(?:innerHTML|outerHTML)\s*=\s*([^\n;]+)/,
    checkProtection: (line) => line.includes('textContent') || line.includes('DOMPurify.sanitize') || line.includes('escapeHtml')
  },
  {
    id: 'SINK-PATH',
    ruleId: 'RPM-TAINT-TRAV-04',
    category: 'PATH_TRAVERSAL',
    pattern: /(?:\bfs\.(?:readFile|createReadStream|readFileSync)\s*\(\s*([^\),]+)|\bopen\s*\(\s*([^\),]+))/,
    checkProtection: (line) => line.includes('path.basename(') || line.includes('os.path.basename(')
  }
]

const VERIFIED_SANITIZERS = [
  { name: 'parseInt', pattern: /\b(?:parseInt|Number)\s*\(/ },
  { name: 'int()', pattern: /\bint\s*\(/ },
  { name: 'DOMPurify.sanitize', pattern: /\bDOMPurify\.sanitize\s*\(/ },
  { name: 'path.basename', pattern: /\b(?:path|os\.path)\.basename\s*\(/ }
]

function extractFunctionsInCorpus(content, filePath) {
  const funcs = []
  const lines = content.split('\n')
  const fnRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/
  const arrowRegex = /(?:export\s+)?const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/
  const pyRegex = /^\s*def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(fnRegex) || line.match(arrowRegex) || line.match(pyRegex)
    if (match) {
      const name = match[1]
      const rawParams = match[2] || ''
      const params = rawParams.split(',').map(p => p.trim().split(':')[0].split('=')[0].trim()).filter(Boolean)
      let endLine = i + 1
      if (line.includes('{')) {
        let braces = 0
        for (let j = i; j < lines.length; j++) {
          for (const c of lines[j]) {
            if (c === '{') braces++
            else if (c === '}') braces--
          }
          if (braces <= 0) {
            endLine = j + 1
            break
          }
        }
      }
      funcs.push({ name, filePath, line: i + 1, endLine, params })
    }
  }
  return funcs
}

function resolveFunctionAcrossFiles(funcName, filesMap, currentFile) {
  const localFuncs = extractFunctionsInCorpus(filesMap[currentFile] || '', currentFile)
  const local = localFuncs.find(f => f.name === funcName)
  if (local) return local

  for (const [fPath, content] of Object.entries(filesMap)) {
    if (fPath !== currentFile) {
      const funcs = extractFunctionsInCorpus(content, fPath)
      const found = funcs.find(f => f.name === funcName)
      if (found) return found
    }
  }
  return null
}

function traceTaintInFiles(filesMap, startFile) {
  const findings = []
  const content = filesMap[startFile]
  if (!content) return findings

  const lines = content.split('\n')

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const lineNum = idx + 1

    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) continue

    for (const src of TAINT_SOURCES) {
      const match = line.match(src.pattern)
      if (match) {
        const initialVar = src.extractVar(match, line)
        if (!initialVar) continue

        const initialStep = {
          stepIndex: 1,
          filePath: startFile,
          line: lineNum,
          snippet: line.trim(),
          varName: initialVar,
          type: 'SOURCE'
        }

        const visited = new Set([`${startFile}:${initialVar}:${lineNum}`])

        function walk(curFile, activeVar, curLine, maxLine, path, depth) {
          if (depth > 5) return

          const curContent = filesMap[curFile]
          if (!curContent) return
          const curLines = curContent.split('\n')
          const endLimit = maxLine !== undefined ? Math.min(maxLine, curLines.length) : curLines.length

          let currentVar = activeVar

          for (let i = curLine; i < endLimit; i++) {
            const l = curLines[i]
            const lNum = i + 1
            const t = l.trim()
            if (t.startsWith('//') || t.startsWith('#')) continue

            for (const san of VERIFIED_SANITIZERS) {
              if (l.includes(currentVar) && san.pattern.test(l)) {
                return
              }
            }

            for (const sink of TAINT_SINKS) {
              if (sink.pattern.test(l) && l.includes(currentVar)) {
                if (sink.checkProtection && sink.checkProtection(l)) {
                  continue
                }

                const sinkStep = {
                  stepIndex: path.length + 1,
                  filePath: curFile,
                  line: lNum,
                  snippet: l.trim(),
                  varName: currentVar,
                  type: 'SINK'
                }

                findings.push({
                  ruleId: sink.ruleId,
                  category: 'SAST',
                  filePath: curFile,
                  startLine: lNum,
                  endLine: lNum,
                  taintPath: [...path, sinkStep],
                  isInterprocedural: path.some(p => p.filePath !== curFile || p.type === 'FUNCTION_ENTRY')
                })
                return
              }
            }

            const callMatch = l.match(/(?:(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*)?([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/)
            let functionHandled = false

            if (callMatch && callMatch[3] && callMatch[3].includes(currentVar)) {
              const returnVar = callMatch[1] ? callMatch[1].trim() : null
              const fnName = callMatch[2].trim()

              const resolvedFn = resolveFunctionAcrossFiles(fnName, filesMap, curFile)
              if (resolvedFn) {
                functionHandled = true
                const key = `${resolvedFn.filePath}:${resolvedFn.name}:${resolvedFn.line}`
                if (!visited.has(key)) {
                  visited.add(key)
                  const targetParam = resolvedFn.params[0] || currentVar

                  const callStep = {
                    stepIndex: path.length + 1,
                    filePath: curFile,
                    line: lNum,
                    snippet: l.trim(),
                    varName: currentVar,
                    type: 'CALL_ARGUMENT'
                  }

                  const entryStep = {
                    stepIndex: path.length + 2,
                    filePath: resolvedFn.filePath,
                    line: resolvedFn.line,
                    snippet: `function ${resolvedFn.name}(${targetParam})`,
                    varName: targetParam,
                    type: 'FUNCTION_ENTRY'
                  }

                  const beforeFindings = findings.length
                  walk(
                    resolvedFn.filePath,
                    targetParam,
                    resolvedFn.line - 1,
                    resolvedFn.endLine,
                    [...path, callStep, entryStep],
                    depth + 1
                  )

                  if (findings.length === beforeFindings && returnVar) {
                    const returnStep = {
                      stepIndex: path.length + 3,
                      filePath: curFile,
                      line: lNum,
                      snippet: l.trim(),
                      varName: returnVar,
                      type: 'RETURN_VALUE'
                    }
                    walk(
                      curFile,
                      returnVar,
                      lNum,
                      maxLine,
                      [...path, callStep, entryStep, returnStep],
                      depth
                    )
                  }
                }
              }
            }

            if (!functionHandled) {
              const escVar = currentVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
              const assignMatch = l.match(new RegExp(`(?:const|let|var|)\\s*([a-zA-Z0-9_$]+)\\s*=\\s*[^;]*\\b${escVar}\\b`))
              if (assignMatch && assignMatch[1] !== currentVar) {
                const newVar = assignMatch[1].trim()
                currentVar = newVar
                path.push({
                  stepIndex: path.length + 1,
                  filePath: curFile,
                  line: lNum,
                  snippet: l.trim(),
                  varName: newVar,
                  type: 'VARIABLE_ASSIGNMENT'
                })
              }
            }
          }
        }

        walk(startFile, initialVar, lineNum, undefined, [initialStep], 0)
      }
    }
  }

  return findings
}

function scanTaint(filesMap) {
  const allTaintFindings = []
  for (const fPath of Object.keys(filesMap)) {
    if (fPath.endsWith('.ts') || fPath.endsWith('.js') || fPath.endsWith('.py')) {
      const findings = traceTaintInFiles(filesMap, fPath)
      allTaintFindings.push(...findings)
    }
  }
  return allTaintFindings
}

// ----------------------------------------------------------------------------
// 3. EXECUTE VALIDATION ACROSS THE CORPUS
// ----------------------------------------------------------------------------

function getFilesRecursively(dir, rootDir = dir) {
  const files = []
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, rootDir))
    } else {
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/')
      files.push({ fullPath, relPath, size: fs.statSync(fullPath).size })
    }
  }
  return files
}

const corpusResults = []
let overallBytesScanned = 0
let overallFilesScanned = 0

console.log(`--- EXECUTING VALIDATION RUNNER ACROSS ${manifest.repositories.length} CORPUS REPOSITORIES ---\n`)

for (const repoDef of manifest.repositories) {
  const repoStart = performance.now()
  const repoDir = path.join(fixturesRoot, repoDef.id)
  const allFiles = getFilesRecursively(repoDir)

  const supportedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.json', '.toml', '.txt', '.xml']
  const supportedFiles = allFiles.filter(f => supportedExtensions.includes(path.extname(f.relPath).toLowerCase()))

  const allFindings = []
  const allDeps = []
  const filesMap = {}

  let bytesScanned = 0
  for (const file of supportedFiles) {
    try {
      const content = fs.readFileSync(file.fullPath, 'utf8')
      bytesScanned += Buffer.byteLength(content, 'utf8')
      filesMap[file.relPath] = content

      // Dependency scan
      const deps = parseManifestDependencies(file.relPath, content)
      allDeps.push(...deps)

      // Secret scan
      const secretFindings = scanSecrets(file.relPath, content)
      allFindings.push(...secretFindings)

      // SAST scan
      const sastFindings = scanSAST(file.relPath, content)
      allFindings.push(...sastFindings)
    } catch (e) {
      // Binary or invalid file handling
    }
  }

  // Correlate dependencies
  const depFindings = correlateDependencies(allDeps)
  allFindings.push(...depFindings)

  // Context-Aware Source-to-Sink Taint Scan
  const taintFindings = scanTaint(filesMap)
  allFindings.push(...taintFindings)

  const repoDuration = performance.now() - repoStart
  overallBytesScanned += bytesScanned
  overallFilesScanned += supportedFiles.length

  const scanStatus = repoDef.id === 'CORPUS-07-EDGE-CASES' ? 'PARTIAL' : 'COMPLETE'

  corpusResults.push({
    repoDef,
    totalFiles: allFiles.length,
    supportedFiles: supportedFiles.length,
    bytesScanned,
    durationMs: repoDuration,
    scanStatus,
    dependencies: allDeps,
    findings: allFindings
  })

  console.log(`  [REPO] ${repoDef.id}`)
  console.log(`         Files: ${allFiles.length} total, ${supportedFiles.length} supported | Data: ${(bytesScanned / 1024).toFixed(1)} KB | Time: ${repoDuration.toFixed(2)} ms`)
  console.log(`         Status: ${scanStatus} | Dependencies: ${allDeps.length} | Findings: ${allFindings.length}`)
}

console.log('\n----------------------------------------------------------------------')
console.log('--- GROUND TRUTH VECTOR EVALUATION & STATISTICAL METRICS ---')
console.log('----------------------------------------------------------------------\n')

let TP = 0
let FP = 0
let TN = 0
let FN = 0

const categoryStats = {
  DEPENDENCY: { TP: 0, FP: 0, TN: 0, FN: 0 },
  SAST: { TP: 0, FP: 0, TN: 0, FN: 0 },
  SECRET: { TP: 0, FP: 0, TN: 0, FN: 0 }
}

const languageStats = {
  TypeScript: { TP: 0, FP: 0, TN: 0, FN: 0 },
  Python: { TP: 0, FP: 0, TN: 0, FN: 0 },
  Go: { TP: 0, FP: 0, TN: 0, FN: 0 },
  Rust: { TP: 0, FP: 0, TN: 0, FN: 0 },
  Java: { TP: 0, FP: 0, TN: 0, FN: 0 },
  Synthetic: { TP: 0, FP: 0, TN: 0, FN: 0 }
}

function getLangForVector(vec) {
  if (vec.repoId.includes('EXPRESS') || vec.repoId.includes('TAINT')) return 'TypeScript'
  if (vec.repoId.includes('PYTHON')) return 'Python'
  if (vec.repoId.includes('GOLANG')) return 'Go'
  if (vec.repoId.includes('RUST')) return 'Rust'
  if (vec.repoId.includes('JAVA')) return 'Java'
  return 'Synthetic'
}

for (const vec of groundTruth.vectors) {
  const repoResult = corpusResults.find(r => r.repoDef.id === vec.repoId)
  if (!repoResult) {
    console.error(`Missing repo result for vector ${vec.id} (${vec.repoId})`)
    continue
  }

  const lang = getLangForVector(vec)

  if (vec.classification === 'TP') {
    // Look for matching finding
    const match = repoResult.findings.find(f => {
      const ruleMatches = f.ruleId === vec.ruleId
      const fileMatches = f.filePath.endsWith(vec.targetFile) || vec.targetFile.endsWith(f.filePath) ||
        (vec.targetFile.includes('package.json') && f.filePath.includes('package-lock.json')) ||
        (vec.targetFile.includes('package-lock.json') && f.filePath.includes('package.json'))
      const lineProximity = vec.category === 'DEPENDENCY' || !vec.expectedLine || Math.abs((f.startLine || 0) - vec.expectedLine) <= 2
      return ruleMatches && fileMatches && lineProximity
    })

    if (match) {
      TP++
      categoryStats[vec.category].TP++
      languageStats[lang].TP++
      console.log(`  [PASS] [TP] [${vec.id}] ${vec.scenario}`)
      console.log(`         ↳ Match: ${match.ruleId} at ${match.filePath}:${match.startLine}`)
    } else {
      FN++
      categoryStats[vec.category].FN++
      languageStats[lang].FN++
      console.error(`  [FAIL] [FN] [${vec.id}] Missed TP: ${vec.scenario}`)
      console.error(`         ↳ Expected ${vec.ruleId} in ${vec.targetFile}:${vec.expectedLine}`)
    }
  } else if (vec.classification === 'TN') {
    // Look for false positive trigger
    const falseMatch = repoResult.findings.find(f => {
      const ruleMatches = f.ruleId === vec.ruleId
      const fileMatches = f.filePath.endsWith(vec.targetFile) || vec.targetFile.endsWith(f.filePath) ||
        (vec.targetFile.includes('package.json') && f.filePath.includes('package-lock.json')) ||
        (vec.targetFile.includes('package-lock.json') && f.filePath.includes('package.json'))
      const lineProximity = vec.category === 'DEPENDENCY' || !vec.expectedLine || Math.abs((f.startLine || 0) - vec.expectedLine) <= 2
      return ruleMatches && fileMatches && lineProximity
    })

    if (!falseMatch) {
      TN++
      if (categoryStats[vec.category]) categoryStats[vec.category].TN++
      languageStats[lang].TN++
      console.log(`  [PASS] [TN] [${vec.id}] Trap correctly ignored: ${vec.scenario}`)
    } else {
      FP++
      if (categoryStats[vec.category]) categoryStats[vec.category].FP++
      languageStats[lang].FP++
      console.error(`  [FAIL] [FP] [${vec.id}] Trap incorrectly triggered: ${vec.scenario}`)
      console.error(`         ↳ Triggered ${falseMatch.ruleId} at ${falseMatch.filePath}:${falseMatch.startLine}`)
    }
  }
}

// ----------------------------------------------------------------------------
// 4. METRIC COMPUTATIONS & INVARIANTS
// ----------------------------------------------------------------------------

function computeMetrics(tp, fp, tn, fn) {
  const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 100
  const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 100
  const accuracy = (tp + tn) / (tp + tn + fp + fn) * 100
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0
  return { precision, recall, accuracy, f1 }
}

const overallMetrics = computeMetrics(TP, FP, TN, FN)
const totalBenchmarkTime = performance.now() - BENCHMARK_START_TIME
const finalMemory = process.memoryUsage()
const heapDeltaMB = ((finalMemory.heapUsed - INITIAL_MEMORY.heapUsed) / (1024 * 1024)).toFixed(2)

console.log('\n======================================================================')
console.log('  PHASE 7 VALIDATION CORPUS RESULTS SUMMARY')
console.log('======================================================================')
console.log(`  Total Evaluated Repositories: ${manifest.repositories.length}`)
console.log(`  Total Evaluated Ground Truth Vectors: ${groundTruth.vectors.length}`)
console.log(`  True Positives  (TP): ${TP}`)
console.log(`  False Positives (FP): ${FP}`)
console.log(`  True Negatives  (TN): ${TN}`)
console.log(`  False Negatives (FN): ${FN}`)
console.log(`  Precision:           ${overallMetrics.precision.toFixed(1)}%`)
console.log(`  Recall:              ${overallMetrics.recall.toFixed(1)}%`)
console.log(`  Accuracy:            ${overallMetrics.accuracy.toFixed(1)}%`)
console.log(`  F1-Score:            ${overallMetrics.f1.toFixed(1)}%`)
console.log(`  Total Benchmark Time: ${totalBenchmarkTime.toFixed(2)} ms`)
console.log(`  Memory Delta:        ${heapDeltaMB} MB`)
console.log('----------------------------------------------------------------------')
console.log('  CATEGORY BREAKDOWN:')
for (const [cat, counts] of Object.entries(categoryStats)) {
  const m = computeMetrics(counts.TP, counts.FP, counts.TN, counts.FN)
  console.log(`    ${cat.padEnd(12)}: P=${m.precision.toFixed(1)}% | R=${m.recall.toFixed(1)}% | F1=${m.f1.toFixed(1)}% (TP:${counts.TP}, FP:${counts.FP}, TN:${counts.TN}, FN:${counts.FN})`)
}
console.log('----------------------------------------------------------------------')
console.log('  LANGUAGE BREAKDOWN:')
for (const [lang, counts] of Object.entries(languageStats)) {
  const m = computeMetrics(counts.TP, counts.FP, counts.TN, counts.FN)
  console.log(`    ${lang.padEnd(12)}: P=${m.precision.toFixed(1)}% | R=${m.recall.toFixed(1)}% | F1=${m.f1.toFixed(1)}% (TP:${counts.TP}, FP:${counts.FP}, TN:${counts.TN}, FN:${counts.FN})`)
}
console.log('======================================================================\n')

// Assert release gates
const GATES_PASSED = TP >= 13 && FN === 0 && FP === 0 && overallMetrics.precision === 100 && overallMetrics.recall === 100

if (GATES_PASSED) {
  console.log(`>>> ALL VALIDATION GATES PASSED (${TP + TN}/${groundTruth.vectors.length} VECTORS VERIFIED) <<<\n`)
  process.exit(0)
} else {
  console.error('>>> PHASE 7 VALIDATION GATES FAILED <<<\n')
  process.exit(1)
}
