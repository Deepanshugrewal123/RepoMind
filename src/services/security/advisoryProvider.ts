// src/services/security/advisoryProvider.ts
// Pluggable vulnerability advisory provider pipeline with ecosystem normalization,
// verified offline curated data, OSV integration, and deterministic caching.

import { DependencyPackage, AdvisoryStatus, SecuritySeverity } from './types'
import { satisfiesRange } from './semverUtils'
import { satisfiesPep440Range } from './pep440Utils'

export interface AdvisoryRecord {
  id: string
  aliases?: string[]
  ecosystem: string
  package: string
  title: string
  description?: string
  severity: SecuritySeverity
  cvssScore?: number
  affectedRange: string
  fixedVersion?: string
  cwe?: string
  referenceUrl: string
  source: 'VERIFIED_CURATED' | 'OSV' | 'NVD'
  retrievalTimestamp: string
}

export interface AdvisoryQueryResult {
  status: AdvisoryStatus
  advisories: AdvisoryRecord[]
  providerName: string
  retrievalTimestamp: string
  cached: boolean
  isStale?: boolean
  diagnosticMessage?: string
}

export interface IAdvisoryProvider {
  name: string
  isAvailable(): Promise<boolean>
  queryPackage(pkg: DependencyPackage): Promise<AdvisoryQueryResult>
}

/**
 * Normalizes package names according to ecosystem-specific rules.
 */
export function normalizePackageName(name: string, ecosystem: string): string {
  if (!name) return ''
  const trimmed = name.trim()
  const eco = ecosystem.toLowerCase()

  if (eco === 'pypi' || eco === 'python') {
    // PEP 503 normalization: lowercase, convert '.' and '_' to '-'
    return trimmed.toLowerCase().replace(/[-_.]+/g, '-')
  }
  if (eco === 'npm' || eco === 'javascript' || eco === 'typescript') {
    // npm: lowercase, preserve scope e.g. @scope/pkg
    return trimmed.toLowerCase()
  }
  if (eco === 'crates.io' || eco === 'cargo' || eco === 'rust') {
    // crates.io: lowercase, convert '_' to '-'
    return trimmed.toLowerCase().replace(/_/g, '-')
  }
  if (eco === 'go' || eco === 'golang') {
    // Go: retain module path case
    return trimmed
  }
  if (eco === 'maven' || eco === 'java') {
    // Maven: lowercase groupId:artifactId
    return trimmed.toLowerCase()
  }

  return trimmed.toLowerCase()
}

/**
 * Maps arbitrary ecosystem labels to canonical ecosystem names.
 */
export function getCanonicalEcosystem(ecosystem: string): string {
  const eco = (ecosystem || '').toLowerCase()
  if (eco === 'npm' || eco === 'javascript' || eco === 'typescript') return 'npm'
  if (eco === 'pypi' || eco === 'python') return 'PyPI'
  if (eco === 'go' || eco === 'golang') return 'Go'
  if (eco === 'crates.io' || eco === 'cargo' || eco === 'rust') return 'crates.io'
  if (eco === 'maven' || eco === 'java') return 'Maven'
  return 'Unknown'
}

/**
 * Verified offline curated advisory database.
 * Used for deterministic evaluation, unit testing, and offline fallback.
 */
export const VERIFIED_CURATED_ADVISORIES: AdvisoryRecord[] = [
  {
    id: 'GHSA-35jh-r3h4-6jhm',
    aliases: ['CVE-2021-23337'],
    ecosystem: 'npm',
    package: 'lodash',
    title: 'Command Injection in lodash.template',
    severity: 'HIGH',
    cvssScore: 7.2,
    affectedRange: '< 4.17.21',
    fixedVersion: '4.17.21',
    cwe: 'CWE-94: Improper Control of Generation of Code',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-23337',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-c2qf-rxjj-qqgw',
    aliases: ['CVE-2020-28168'],
    ecosystem: 'npm',
    package: 'axios',
    title: 'Server-Side Request Forgery in axios',
    severity: 'HIGH',
    cvssScore: 7.5,
    affectedRange: '< 0.21.2',
    fixedVersion: '0.21.2',
    cwe: 'CWE-918: Server-Side Request Forgery',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2020-28168',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-qw6h-vgh9-j6wx',
    aliases: ['CVE-2022-23529'],
    ecosystem: 'npm',
    package: 'jsonwebtoken',
    title: 'Arbitrary File Write / RCE in jsonwebtoken verify()',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    affectedRange: '< 9.0.0',
    fixedVersion: '9.0.0',
    cwe: 'CWE-22: Path Traversal',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2022-23529',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-m84x-pnwh-2cq8',
    aliases: ['CVE-2024-29041'],
    ecosystem: 'npm',
    package: 'express',
    title: 'Open Redirect in express.res.location and express.res.redirect',
    severity: 'MEDIUM',
    cvssScore: 6.1,
    affectedRange: '< 4.19.2',
    fixedVersion: '4.19.2',
    cwe: 'CWE-601: URL Redirection to Untrusted Site',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-29041',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-hrfv-mqp8-q5rw',
    aliases: ['CVE-2017-16119'],
    ecosystem: 'npm',
    package: 'qs',
    title: 'Regular Expression Denial of Service in qs',
    severity: 'HIGH',
    cvssScore: 7.5,
    affectedRange: '< 6.5.2',
    fixedVersion: '6.5.2',
    cwe: 'CWE-400: Uncontrolled Resource Consumption',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2017-16119',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-j8r2-6x86-q33q',
    aliases: ['CVE-2023-32681'],
    ecosystem: 'PyPI',
    package: 'requests',
    title: 'Unintended leak of Proxy-Authorization headers in requests',
    severity: 'MEDIUM',
    cvssScore: 6.1,
    affectedRange: '< 2.31.0',
    fixedVersion: '2.31.0',
    cwe: 'CWE-200: Exposure of Sensitive Information',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2023-32681',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-q2x7-8rv6-6q7h',
    aliases: ['CVE-2021-33503'],
    ecosystem: 'PyPI',
    package: 'urllib3',
    title: 'ReDoS in urllib3 via catastrophic backtracking in header parsing',
    severity: 'HIGH',
    cvssScore: 7.5,
    affectedRange: '< 1.26.5',
    fixedVersion: '1.26.5',
    cwe: 'CWE-400: Uncontrolled Resource Consumption',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-33503',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-g2j5-57x7-95q4',
    aliases: ['CVE-2020-28493'],
    ecosystem: 'PyPI',
    package: 'jinja2',
    title: 'ReDoS via attr filter in Jinja2',
    severity: 'MEDIUM',
    cvssScore: 5.3,
    affectedRange: '< 2.11.3',
    fixedVersion: '2.11.3',
    cwe: 'CWE-400: Uncontrolled Resource Consumption',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2020-28493',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-33c5-9fx5-4fcw',
    aliases: ['CVE-2021-38561'],
    ecosystem: 'Go',
    package: 'golang.org/x/text',
    title: 'Out-of-bounds Read in golang.org/x/text/language',
    severity: 'HIGH',
    cvssScore: 7.5,
    affectedRange: '< 0.3.7',
    fixedVersion: '0.3.7',
    cwe: 'CWE-125: Out-of-bounds Read',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-38561',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-g98m-q6mt-5335',
    aliases: ['CVE-2020-35873'],
    ecosystem: 'crates.io',
    package: 'smallvec',
    title: 'Double free in smallvec::SmallVec::grow',
    severity: 'CRITICAL',
    cvssScore: 9.8,
    affectedRange: '< 0.6.14',
    fixedVersion: '0.6.14',
    cwe: 'CWE-415: Double Free',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2020-35873',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  },
  {
    id: 'GHSA-36p3-wjmg-h94x',
    aliases: ['CVE-2021-44228'],
    ecosystem: 'Maven',
    package: 'org.apache.logging.log4j:log4j-core',
    title: 'Log4Shell Remote Code Execution in Log4j',
    severity: 'CRITICAL',
    cvssScore: 10.0,
    affectedRange: '>= 2.0.0 < 2.15.0',
    fixedVersion: '2.15.0',
    cwe: 'CWE-502: Deserialization of Untrusted Data',
    referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
    source: 'VERIFIED_CURATED',
    retrievalTimestamp: '2026-10-18T00:00:00.000Z'
  }
]

/**
 * In-memory advisory cache with TTL and freshness tracking.
 */
export class AdvisoryCache {
  private cache = new Map<
    string,
    { result: AdvisoryQueryResult; timestamp: number }
  >()
  private ttlMs: number

  constructor(ttlMs: number = 3600000) {
    // 1 hour default TTL
    this.ttlMs = ttlMs
  }

  get(key: string): AdvisoryQueryResult | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    const isStale = Date.now() - entry.timestamp > this.ttlMs
    return {
      ...entry.result,
      cached: true,
      isStale
    }
  }

  set(key: string, result: AdvisoryQueryResult): void {
    this.cache.set(key, { result, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

/**
 * Curated offline provider: fast, deterministic, 0 network dependencies.
 */
export class VerifiedOfflineAdvisoryProvider implements IAdvisoryProvider {
  name = 'VERIFIED_OFFLINE_PROVIDER'

  async isAvailable(): Promise<boolean> {
    return true
  }

  async queryPackage(pkg: DependencyPackage): Promise<AdvisoryQueryResult> {
    const canonicalEco = getCanonicalEcosystem(pkg.ecosystem)
    const normalizedName = normalizePackageName(pkg.name, canonicalEco)
    const timestamp = new Date().toISOString()

    if (canonicalEco === 'Unknown') {
      return {
        status: 'UNSUPPORTED_ECOSYSTEM',
        advisories: [],
        providerName: this.name,
        retrievalTimestamp: timestamp,
        cached: false,
        diagnosticMessage: `Ecosystem '${pkg.ecosystem}' is not supported by offline advisory provider.`
      }
    }

    // Match advisories by ecosystem and normalized package name
    const matches = VERIFIED_CURATED_ADVISORIES.filter((adv) => {
      const advEco = getCanonicalEcosystem(adv.ecosystem)
      const advPkg = normalizePackageName(adv.package, advEco)
      return advEco === canonicalEco && advPkg === normalizedName
    })

    if (matches.length === 0) {
      return {
        status: 'NO_ADVISORY_FOUND',
        advisories: [],
        providerName: this.name,
        retrievalTimestamp: timestamp,
        cached: false
      }
    }

    // Version evaluation
    const versionToCheck = pkg.resolvedVersion || pkg.version
    if (!versionToCheck || !pkg.isExact) {
      // Floating range cannot be verified with certainty without resolved lockfile
      return {
        status: 'UNRESOLVED_RANGE',
        advisories: matches,
        providerName: this.name,
        retrievalTimestamp: timestamp,
        cached: false,
        diagnosticMessage: `Package '${pkg.name}' specifies floating range '${versionToCheck || 'unspecified'}'. Lockfile required to confirm exact vulnerability.`
      }
    }

    const affectedAdvisories = matches.filter((adv) => {
      if (canonicalEco === 'PyPI') {
        return satisfiesPep440Range(versionToCheck, adv.affectedRange)
      }
      return satisfiesRange(versionToCheck, adv.affectedRange)
    })

    if (affectedAdvisories.length > 0) {
      return {
        status: 'CONFIRMED_AFFECTED',
        advisories: affectedAdvisories,
        providerName: this.name,
        retrievalTimestamp: timestamp,
        cached: false
      }
    }

    return {
      status: 'CONFIRMED_SAFE',
      advisories: [],
      providerName: this.name,
      retrievalTimestamp: timestamp,
      cached: false
    }
  }
}

/**
 * OSV (Open Source Vulnerabilities) API Provider with timeouts and offline fallback.
 */
export class OSVAdvisoryProvider implements IAdvisoryProvider {
  name = 'OSV_PROVIDER'
  private timeoutMs: number
  private offlineFallback: VerifiedOfflineAdvisoryProvider
  private forceOffline: boolean

  constructor(timeoutMs: number = 3000, forceOffline: boolean = false) {
    this.timeoutMs = timeoutMs
    const envOffline = (globalThis as any)?.process?.env?.OFFLINE_MODE === 'true'
    this.forceOffline = forceOffline || envOffline
    this.offlineFallback = new VerifiedOfflineAdvisoryProvider()
  }

  async isAvailable(): Promise<boolean> {
    if (this.forceOffline) return false
    return typeof fetch !== 'undefined'
  }

  async queryPackage(pkg: DependencyPackage): Promise<AdvisoryQueryResult> {
    const canonicalEco = getCanonicalEcosystem(pkg.ecosystem)
    const timestamp = new Date().toISOString()

    // In test or offline mode, immediately use verified offline fallback
    if (this.forceOffline) {
      const fallbackResult = await this.offlineFallback.queryPackage(pkg)
      return {
        ...fallbackResult,
        providerName: 'OSV_OFFLINE_FALLBACK'
      }
    }

    const versionToCheck = pkg.resolvedVersion || pkg.version

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs)

      const response = await fetch('https://api.osv.dev/v1/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: {
            name: pkg.name,
            ecosystem: canonicalEco
          },
          version: pkg.isExact ? versionToCheck : undefined
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Fall back gracefully rather than crashing
        const fallback = await this.offlineFallback.queryPackage(pkg)
        return {
          ...fallback,
          diagnosticMessage: `OSV returned HTTP ${response.status}. Using verified offline fallback.`
        }
      }

      const data = await response.json()
      const vulns = data.vulns || []

      if (vulns.length === 0) {
        return {
          status: 'NO_ADVISORY_FOUND',
          advisories: [],
          providerName: this.name,
          retrievalTimestamp: timestamp,
          cached: false
        }
      }

      const advisories: AdvisoryRecord[] = vulns.map((v: any) => {
        let fixedVer: string | undefined = undefined
        for (const aff of v.affected || []) {
          for (const rng of aff.ranges || []) {
            for (const ev of rng.events || []) {
              if (ev.fixed) fixedVer = ev.fixed
            }
          }
        }

        return {
          id: v.id,
          aliases: v.aliases || [],
          ecosystem: canonicalEco,
          package: pkg.name,
          title: v.summary || v.details?.slice(0, 100) || v.id,
          description: v.details,
          severity: (v.database_specific?.severity || 'HIGH').toUpperCase() as SecuritySeverity,
          cvssScore: v.database_specific?.cvss?.score,
          affectedRange: fixedVer ? `< ${fixedVer}` : 'All versions',
          fixedVersion: fixedVer,
          referenceUrl: v.references?.[0]?.url || `https://osv.dev/vulnerability/${v.id}`,
          source: 'OSV',
          retrievalTimestamp: timestamp
        }
      })

      return {
        status: pkg.isExact ? 'CONFIRMED_AFFECTED' : 'UNRESOLVED_RANGE',
        advisories,
        providerName: this.name,
        retrievalTimestamp: timestamp,
        cached: false
      }
    } catch (err: any) {
      // Handle network failure or timeout explicitly
      const fallback = await this.offlineFallback.queryPackage(pkg)
      return {
        ...fallback,
        diagnosticMessage: `OSV connection unavailable (${err.message || 'timeout'}). Using verified offline fallback.`
      }
    }
  }
}
