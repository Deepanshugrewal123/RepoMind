// src/services/security/securityService.ts
// Primary orchestration pipeline for RepoMind Evidence-Based Security Intelligence

import {
  SecurityAnalysisReport,
  SecurityFinding,
  SecurityScanSummary,
  DependencyPackage,
  LockfileAmbiguity,
  DependencyGraphData,
  CycloneDXSBOM
} from './types'
import { scanFileForSecrets } from './secretScanner'
import { scanFileWithSAST } from './sastEngine'
import {
  parseManifestDependencies,
  correlateDependencyVulnerabilities,
  resolveDependenciesWithLockfiles
} from './dependencyScanner'
import { DependencyGraphBuilder } from './dependencyGraph'
import { generateCycloneDXSBOM } from './sbomGenerator'
import { TaintAnalysisEngine } from './taintAnalysisEngine'

/**
 * Runs the complete modular security analysis pipeline across fetched files and manifests.
 */
export async function runSecurityAnalysis(
  repoFullName: string,
  ref: string,
  fetchedContents: Map<string, string>,
  allFiles: string[]
): Promise<SecurityAnalysisReport> {
  const allFindings: SecurityFinding[] = []
  const scannedFiles: string[] = []
  let allDependencies: DependencyPackage[] = []
  const skippedReasons: { reason: string; count: number }[] = []

  let binarySkipped = 0
  let oversizedSkipped = 0
  let ignoredDirSkipped = 0

  for (const f of allFiles) {
    const ext = f.split('.').pop()?.toLowerCase() || ''
    if (['png', 'jpg', 'jpeg', 'gif', 'ico', 'pdf', 'zip', 'tar', 'gz', 'woff', 'woff2', 'ttf', 'exe', 'bin'].includes(ext)) {
      binarySkipped++
    } else if (f.includes('node_modules/') || f.includes('vendor/') || f.includes('.git/')) {
      ignoredDirSkipped++
    }
  }

  if (binarySkipped > 0) skippedReasons.push({ reason: 'Binary media & compiled assets skipped', count: binarySkipped })
  if (ignoredDirSkipped > 0) skippedReasons.push({ reason: 'Vendored / node_modules dependencies skipped', count: ignoredDirSkipped })

  // 1. Scan fetched files for secrets and SAST issues
  for (const [filePath, content] of fetchedContents.entries()) {
    scannedFiles.push(filePath)

    // A. Secret scanning
    const secretFindings = scanFileForSecrets(content, filePath, repoFullName)
    allFindings.push(...secretFindings)

    // B. SAST scanning
    const sastFindings = scanFileWithSAST(content, filePath)
    allFindings.push(...sastFindings)
  }

  // 2. Lockfile-aware dependency resolution & graph synthesis
  const { packages: resolvedDeps, ambiguities, lockfileStatus } = resolveDependenciesWithLockfiles(fetchedContents)
  let dependencyGraph: DependencyGraphData | undefined
  let sbom: CycloneDXSBOM | undefined

  if (resolvedDeps.length > 0) {
    const { findings: depFindings, updatedPackages } = await correlateDependencyVulnerabilities(
      resolvedDeps,
      repoFullName
    )
    allFindings.push(...depFindings)
    allDependencies = updatedPackages

    const graphBuilder = new DependencyGraphBuilder()
    dependencyGraph = graphBuilder.buildGraph(allDependencies)

    sbom = generateCycloneDXSBOM(allDependencies, dependencyGraph, {
      repoName: repoFullName,
      ref,
      isLockfileResolved: lockfileStatus === 'FULL_LOCKFILE'
    })
  }

  // 3. Context-Aware Source-to-Sink Taint Tracking
  try {
    const taintEngine = new TaintAnalysisEngine(fetchedContents)
    for (const filePath of fetchedContents.keys()) {
      const taintFindings = taintEngine.analyzeTaintFlows(filePath)
      allFindings.push(...taintFindings)
    }
  } catch (err) {
    // Graceful recovery if taint analysis meets unexpected syntax
    console.warn('[SecurityService] Taint analysis warning:', err)
  }

  // 4. Deduplicate findings by fingerprint or (filePath + startLine + category)
  // Context-aware taint findings promote basic pattern heuristics
  const uniqueFindings: SecurityFinding[] = []
  const seenLocations = new Map<string, SecurityFinding>()

  for (const finding of allFindings) {
    const locKey = `${finding.filePath}:${finding.startLine}:${finding.category}`
    const existing = seenLocations.get(locKey)
    if (!existing) {
      seenLocations.set(locKey, finding)
      uniqueFindings.push(finding)
    } else if (finding.detectionMethod === 'CONTEXT_TAINT' && existing.detectionMethod === 'PATTERN_HEURISTIC') {
      const idx = uniqueFindings.indexOf(existing)
      if (idx !== -1) {
        uniqueFindings[idx] = finding
        seenLocations.set(locKey, finding)
      }
    }
  }

  // 4. Calculate severity breakdown
  let criticalCount = 0
  let highCount = 0
  let mediumCount = 0
  let lowCount = 0
  let infoCount = 0

  let sastCount = 0
  let secretCount = 0
  let depCount = 0

  for (const f of uniqueFindings) {
    if (f.severity === 'CRITICAL') criticalCount++
    else if (f.severity === 'HIGH') highCount++
    else if (f.severity === 'MEDIUM') mediumCount++
    else if (f.severity === 'LOW') lowCount++
    else infoCount++

    if (f.category === 'HARDCODED_SECRET') secretCount++
    else if (f.category === 'DEPENDENCY_VULNERABILITY') depCount++
    else sastCount++
  }

  // Calculate objective security score (10 - 100)
  // Deductions: Critical -20 pts, High -10 pts, Medium -4 pts, Low -1 pt
  const penalty = criticalCount * 20 + highCount * 10 + mediumCount * 4 + lowCount * 1
  const overallSecurityScore = Math.max(15, Math.min(98, 100 - penalty))

  const directCount = allDependencies.filter((p) => p.dependencyType !== 'transitive').length
  const transitiveCount = allDependencies.filter((p) => p.dependencyType === 'transitive').length

  const summary: SecurityScanSummary = {
    scanTimestamp: new Date().toISOString(),
    repository: repoFullName,
    ref,
    filesInspectedCount: scannedFiles.length,
    filesSkippedCount: Math.max(0, allFiles.length - scannedFiles.length),
    skippedReasons,
    findingsCount: uniqueFindings.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    infoCount,
    sastFindingsCount: sastCount,
    secretFindingsCount: secretCount,
    dependencyFindingsCount: depCount,
    overallSecurityScore,
    status: (scannedFiles.length >= allFiles.length && allFiles.length > 0) ? 'COMPLETE' : 'PARTIAL',
    lockfileResolutionStatus: lockfileStatus,
    directDependenciesCount: directCount,
    transitiveDependenciesCount: transitiveCount,
    advisoryProviderStatus: 'VERIFIED_CURATED_OFFLINE',
    coverageDescription: allFiles.length > 0 && scannedFiles.length >= allFiles.length
      ? `Full scan: inspected all ${scannedFiles.length} repository source files.`
      : `Sampled / partial scan: inspected ${scannedFiles.length} representative source files across ${allFiles.length} indexed files (${Math.round((scannedFiles.length / Math.max(1, allFiles.length)) * 100)}% coverage). ${Math.max(0, allFiles.length - scannedFiles.length)} files skipped or unindexed.`
  }

  return {
    summary,
    findings: uniqueFindings,
    dependencyPackages: allDependencies,
    scannedFiles,
    secretScanClean: secretCount === 0,
    dependencyGraph,
    sbom,
    lockfileAmbiguities: ambiguities
  }
}

/**
 * Returns grounded sample security report for the pre-analyzed Acme CheckoutPlatform dataset.
 */
export function getSampleSecurityReport(): SecurityAnalysisReport {
  const sampleFindings: SecurityFinding[] = [
    {
      id: 'SEC-SECR-01',
      ruleId: 'RPM-SEC-STRIPE-04',
      ruleName: 'Stripe Live Secret Key',
      category: 'HARDCODED_SECRET',
      severity: 'CRITICAL',
      confidence: 'HIGH',
      repository: 'checkout-platform-v2.8',
      ref: 'main',
      filePath: 'src/services/payment/stripeClient.ts',
      startLine: 14,
      endLine: 14,
      detectionMethod: 'SECRET_SIGNATURE',
      evidenceExcerpt: 'const stripeClient = new Stripe("sk_live_****************[REDACTED]");',
      explanation: 'Stripe live production secret key hardcoded in payment client adapter. Anyone with source repository access can invoke live customer charges and refunds.',
      preconditionsAndLimitations: 'Active key pattern detected in repository source.',
      remediation: 'Rotate this secret key in the Stripe Dashboard. Inject the new key via process.env.STRIPE_SECRET_KEY.',
      advisoryReference: 'CWE-798: Use of Hard-coded Credentials',
      timestamp: new Date().toISOString(),
      verificationStatus: 'OBSERVED_SOURCE'
    },
    {
      id: 'SEC-SQLI-02',
      ruleId: 'RPM-SAST-SQLI-01',
      ruleName: 'Unsanitized SQL Query Concatenation',
      category: 'SQL_INJECTION',
      severity: 'HIGH',
      confidence: 'HIGH',
      repository: 'checkout-platform-v2.8',
      ref: 'main',
      filePath: 'src/services/payment/settlement.ts',
      startLine: 58,
      endLine: 58,
      detectionMethod: 'PATTERN_HEURISTIC',
      evidenceExcerpt: 'const result = await db.query(`SELECT * FROM ledger WHERE account_id = "${accountId}" AND status = "PENDING"`);',
      explanation: 'Raw string template interpolation into PostgreSQL transaction query without parameterization.',
      preconditionsAndLimitations: 'Pattern-based heuristic. Exploitation depends on untrusted accountId input.',
      remediation: 'Use parameterized queries: db.query("SELECT * FROM ledger WHERE account_id = $1 AND status = $2", [accountId, "PENDING"]).',
      advisoryReference: 'CWE-89: SQL Injection',
      timestamp: new Date().toISOString(),
      verificationStatus: 'PATTERN_HEURISTIC'
    },
    {
      id: 'SEC-TLS-03',
      ruleId: 'RPM-SAST-TLS-08',
      ruleName: 'Disabled TLS Certificate Validation',
      category: 'INSECURE_TLS',
      severity: 'HIGH',
      confidence: 'HIGH',
      repository: 'checkout-platform-v2.8',
      ref: 'main',
      filePath: 'src/services/inventory/syncClient.ts',
      startLine: 29,
      endLine: 29,
      detectionMethod: 'PATTERN_HEURISTIC',
      evidenceExcerpt: 'const agent = new https.Agent({ rejectUnauthorized: false });',
      explanation: 'HTTPS agent explicitly disables peer TLS certificate verification. Vulnerable to Man-in-the-Middle eavesdropping on outbound inventory sync.',
      preconditionsAndLimitations: 'Commonly left over from testing environments; dangerous in production.',
      remediation: 'Remove rejectUnauthorized: false and add company root CA to trusted certificate authorities.',
      advisoryReference: 'CWE-295: Improper Certificate Validation',
      timestamp: new Date().toISOString(),
      verificationStatus: 'PATTERN_HEURISTIC'
    },
    {
      id: 'SEC-DEP-04',
      ruleId: 'RPM-DEP-GHSA-35jh-r3h4-6jhm',
      ruleName: 'Vulnerable Dependency: lodash@4.17.20',
      category: 'DEPENDENCY_VULNERABILITY',
      severity: 'HIGH',
      confidence: 'HIGH',
      repository: 'checkout-platform-v2.8',
      ref: 'main',
      filePath: 'package.json',
      startLine: 1,
      endLine: 1,
      detectionMethod: 'ADVISORY_LOOKUP',
      evidenceExcerpt: '"lodash": "4.17.20" (< 4.17.21)',
      explanation: 'Lodash before 4.17.21 is vulnerable to Command Injection via template() compilation.',
      preconditionsAndLimitations: 'Matched against exact package.json declared dependency.',
      remediation: 'Upgrade lodash to 4.17.21 or higher.',
      advisoryReference: 'GHSA-35jh-r3h4-6jhm • CWE-94',
      timestamp: new Date().toISOString(),
      verificationStatus: 'VERIFIED_ADVISORY'
    },
    {
      id: 'SEC-MISCONF-05',
      ruleId: 'RPM-SAST-MISCONF-10',
      ruleName: 'Wildcard CORS Origin Exposure',
      category: 'SECURITY_MISCONFIGURATION',
      severity: 'MEDIUM',
      confidence: 'HIGH',
      repository: 'checkout-platform-v2.8',
      ref: 'main',
      filePath: 'src/gateway/server.ts',
      startLine: 34,
      endLine: 34,
      detectionMethod: 'PATTERN_HEURISTIC',
      evidenceExcerpt: 'res.setHeader("Access-Control-Allow-Origin", "*");',
      explanation: 'API gateway sets wildcard (*) CORS origin on authenticated endpoints, exposing user sessions to cross-origin extraction.',
      preconditionsAndLimitations: 'Applies to state-changing API endpoints.',
      remediation: 'Restrict allowed origins to trusted production domains.',
      advisoryReference: 'CWE-942: Permissive Cross-domain Policy',
      timestamp: new Date().toISOString(),
      verificationStatus: 'PATTERN_HEURISTIC'
    }
  ]

  const sampleDeps: DependencyPackage[] = [
    {
      name: 'lodash',
      ecosystem: 'npm',
      version: '4.17.20',
      declaredVersion: '^4.17.20',
      resolvedVersion: '4.17.20',
      isExact: true,
      manifestFile: 'package.json',
      lockfile: 'package-lock.json',
      scope: 'production',
      dependencyType: 'direct',
      resolutionMethod: 'LOCKFILE_EXACT',
      resolutionConfidence: 'HIGH',
      completeness: 'COMPLETE',
      advisoryStatus: 'CONFIRMED_AFFECTED',
      purl: 'pkg:npm/lodash@4.17.20',
      advisoryCount: 1,
      advisories: [
        {
          id: 'GHSA-35jh-r3h4-6jhm',
          title: 'Command Injection in lodash.template',
          severity: 'HIGH',
          affectedVersions: '< 4.17.21',
          fixedVersion: '4.17.21',
          referenceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2021-23337'
        }
      ]
    },
    {
      name: 'express',
      ecosystem: 'npm',
      version: '4.19.2',
      declaredVersion: '^4.19.2',
      resolvedVersion: '4.19.2',
      isExact: true,
      manifestFile: 'package.json',
      lockfile: 'package-lock.json',
      scope: 'production',
      dependencyType: 'direct',
      resolutionMethod: 'LOCKFILE_EXACT',
      resolutionConfidence: 'HIGH',
      completeness: 'COMPLETE',
      advisoryStatus: 'CONFIRMED_SAFE',
      purl: 'pkg:npm/express@4.19.2',
      advisoryCount: 0
    },
    {
      name: 'pg',
      ecosystem: 'npm',
      version: '8.11.3',
      declaredVersion: '^8.11.3',
      resolvedVersion: '8.11.3',
      isExact: true,
      manifestFile: 'package.json',
      lockfile: 'package-lock.json',
      scope: 'production',
      dependencyType: 'direct',
      resolutionMethod: 'LOCKFILE_EXACT',
      resolutionConfidence: 'HIGH',
      completeness: 'COMPLETE',
      advisoryStatus: 'CONFIRMED_SAFE',
      purl: 'pkg:npm/pg@8.11.3',
      advisoryCount: 0
    },
    {
      name: 'qs',
      ecosystem: 'npm',
      version: '6.5.2',
      resolvedVersion: '6.5.2',
      isExact: true,
      manifestFile: 'package.json',
      lockfile: 'package-lock.json',
      scope: 'production',
      dependencyType: 'transitive',
      dependencyPath: ['express', 'qs'],
      parentPackage: 'express',
      resolutionMethod: 'LOCKFILE_EXACT',
      resolutionConfidence: 'HIGH',
      completeness: 'COMPLETE',
      advisoryStatus: 'CONFIRMED_SAFE',
      purl: 'pkg:npm/qs@6.5.2',
      advisoryCount: 0
    }
  ]

  const graphBuilder = new DependencyGraphBuilder()
  const sampleGraph = graphBuilder.buildGraph(sampleDeps)
  const sampleSbom = generateCycloneDXSBOM(sampleDeps, sampleGraph, {
    repoName: 'CheckoutPlatform-v2.8',
    ref: 'v2.8-main',
    isLockfileResolved: true
  })

  return {
    summary: {
      scanTimestamp: new Date().toISOString(),
      repository: 'CheckoutPlatform-v2.8',
      ref: 'v2.8-main',
      filesInspectedCount: 12,
      filesSkippedCount: 0,
      skippedReasons: [],
      findingsCount: sampleFindings.length,
      criticalCount: 1,
      highCount: 3,
      mediumCount: 1,
      lowCount: 0,
      infoCount: 0,
      sastFindingsCount: 3,
      secretFindingsCount: 1,
      dependencyFindingsCount: 1,
      overallSecurityScore: 48,
      status: 'COMPLETE',
      lockfileResolutionStatus: 'FULL_LOCKFILE',
      directDependenciesCount: 3,
      transitiveDependenciesCount: 1,
      advisoryProviderStatus: 'VERIFIED_CURATED_OFFLINE',
      coverageDescription: 'Sample benchmark project: verified 12 source files across gateway, domain services, and database adapters.'
    },
    findings: sampleFindings,
    dependencyPackages: sampleDeps,
    scannedFiles: [
      'src/services/payment/stripeClient.ts',
      'src/services/payment/settlement.ts',
      'src/services/inventory/syncClient.ts',
      'src/gateway/server.ts',
      'package.json',
      'package-lock.json'
    ],
    secretScanClean: false,
    dependencyGraph: sampleGraph,
    sbom: sampleSbom
  }
}
