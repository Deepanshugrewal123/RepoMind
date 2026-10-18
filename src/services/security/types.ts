// src/services/security/types.ts
// Strict, evidence-backed security data models and schemas for RepoMind Phase 6

export type SecuritySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL'

export type SecurityConfidence = 'HIGH' | 'MEDIUM' | 'LOW'

export type SecurityCategory = 
  | 'SQL_INJECTION'
  | 'XSS'
  | 'COMMAND_INJECTION'
  | 'PATH_TRAVERSAL'
  | 'UNSAFE_DESERIALIZATION'
  | 'SSRF'
  | 'INSECURE_CRYPTO'
  | 'HARDCODED_SECRET'
  | 'INSECURE_TLS'
  | 'DYNAMIC_CODE_EXECUTION'
  | 'SECURITY_MISCONFIGURATION'
  | 'MISSING_SECURITY_CONTROL'
  | 'DEPENDENCY_VULNERABILITY'

export type DetectionMethod =
  | 'PATTERN_HEURISTIC'
  | 'SECRET_SIGNATURE'
  | 'ENTROPY_ANALYSIS'
  | 'ADVISORY_LOOKUP'
  | 'MANIFEST_ANALYSIS'
  | 'CONTEXT_TAINT'

export type VerificationStatus = 
  | 'OBSERVED_SOURCE'
  | 'PATTERN_HEURISTIC'
  | 'VERIFIED_ADVISORY'
  | 'NEEDS_TRIAGE'
  | 'CONFIRMED_FLOW'
  | 'UNRESOLVED_CONTEXT'

export interface CodeLocation {
  filePath: string
  line: number
  symbol?: string
  snippet: string
}

export interface TaintPathStep {
  stepIndex: number
  filePath: string
  line: number
  codeSnippet: string
  variableName?: string
  stepType:
    | 'SOURCE'
    | 'VARIABLE_ASSIGNMENT'
    | 'CALL_ARGUMENT'
    | 'FUNCTION_ENTRY'
    | 'RETURN_VALUE'
    | 'CROSS_FILE_IMPORT'
    | 'SANITIZER_CHECK'
    | 'SINK'
  description: string
}

export interface SecurityFinding {
  id: string                              // Unique stable ID (e.g. SEC-SQLI-001)
  ruleId: string                          // Stable rule ID (e.g. RPM-SAST-SQLI-01)
  ruleName: string                        // Readable rule name
  category: SecurityCategory
  severity: SecuritySeverity              // Independent of confidence
  confidence: SecurityConfidence          // Independent of severity
  repository?: string                     // Repository full name (e.g. owner/repo)
  ref?: string                            // Commit hash or branch
  filePath: string                        // Target file relative path
  startLine: number                       // 1-indexed start line
  endLine: number                         // 1-indexed end line
  detectionMethod: DetectionMethod
  evidenceExcerpt: string                 // Safely redacted snippet
  explanation: string                     // Technical root-cause explanation
  preconditionsAndLimitations: string     // Prerequisites, context, and scanner limitations
  remediation: string                     // Specific actionable code fix guidance
  advisoryReference?: string              // E.g. CWE-89, OWASP Top 10, GHSA-..., CVE-...
  timestamp: string                       // ISO timestamp or detection time
  verificationStatus: VerificationStatus
  fingerprint?: string                    // Hash of rule + path + line content for deduplication
  sourceLocation?: CodeLocation           // Originating untrusted input source
  sinkLocation?: CodeLocation             // Dangerous API sink location
  taintPath?: TaintPathStep[]             // Step-by-step evidence-backed propagation trail
  sanitizersEncountered?: string[]        // Recognized defenses or sanitizers along the path
  isInterprocedural?: boolean             // Whether the flow crosses function or module boundaries
}

export interface SecurityScanSummary {
  scanTimestamp: string
  repository: string
  ref: string
  filesInspectedCount: number
  filesSkippedCount: number
  skippedReasons: { reason: string; count: number }[]
  findingsCount: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  infoCount: number
  sastFindingsCount: number
  secretFindingsCount: number
  dependencyFindingsCount: number
  overallSecurityScore: number           // 0-100 derived strictly from findings
  status: 'COMPLETE' | 'PARTIAL' | 'ERROR'
  incompleteStages?: string[]
  coverageDescription: string
  lockfileResolutionStatus?: 'FULL_LOCKFILE' | 'PARTIAL_LOCKFILE' | 'MANIFEST_ONLY' | 'COMPETING_LOCKFILES'
  directDependenciesCount?: number
  transitiveDependenciesCount?: number
  advisoryProviderStatus?: string
}

export type DependencyScope = 'production' | 'development' | 'optional' | 'peer' | 'unknown'
export type DependencyType = 'direct' | 'transitive'
export type ResolutionMethod = 'LOCKFILE_EXACT' | 'MANIFEST_DECLARED' | 'MANIFEST_RANGE_UNRESOLVED' | 'INFERRED'
export type ResolutionConfidence = 'HIGH' | 'MEDIUM' | 'LOW'
export type AdvisoryStatus =
  | 'CONFIRMED_AFFECTED'
  | 'CONFIRMED_SAFE'
  | 'UNRESOLVED_RANGE'
  | 'NO_ADVISORY_FOUND'
  | 'PROVIDER_UNAVAILABLE'
  | 'UNSUPPORTED_ECOSYSTEM'
  | 'CONFLICTING_ADVISORY_DATA'

export interface DependencyPackage {
  name: string
  ecosystem: 'npm' | 'PyPI' | 'Go' | 'crates.io' | 'Maven' | 'Unknown'
  version?: string
  declaredVersion?: string
  resolvedVersion?: string
  isExact: boolean
  manifestFile: string
  lockfile?: string
  line?: number
  scope?: DependencyScope
  dependencyType?: DependencyType
  dependencyPath?: string[]
  parentPackage?: string
  resolutionMethod?: ResolutionMethod
  resolutionConfidence?: ResolutionConfidence
  completeness?: 'COMPLETE' | 'INFERRED' | 'UNRESOLVED' | 'UNSUPPORTED'
  advisoryStatus?: AdvisoryStatus
  purl?: string
  license?: string
  advisoryCount: number
  advisories?: {
    id: string
    title: string
    severity: SecuritySeverity
    cvssScore?: number
    affectedVersions: string
    fixedVersion?: string
    referenceUrl: string
  }[]
}

export interface DependencyNode {
  id: string
  name: string
  version: string
  ecosystem: string
  isDirect: boolean
  scope: DependencyScope
  depth: number
  purl: string
  manifestFile: string
  dependencies: string[]
  dependents: string[]
  advisories?: string[]
}

export interface DependencyGraphData {
  nodes: Record<string, DependencyNode>
  directDependencies: string[]
  transitiveDependencies: string[]
  duplicates: Record<string, string[]>
  cycles: string[][]
  totalCount: number
}

export interface LockfileAmbiguity {
  ecosystem: string
  detectedLockfiles: string[]
  chosenLockfile: string
  explanation: string
}

export interface CycloneDXComponent {
  type: 'library' | 'application' | 'framework'
  'bom-ref': string
  name: string
  version: string
  purl: string
  scope?: 'required' | 'optional' | 'excluded'
  description?: string
  licenses?: { license: { id?: string; name?: string } }[]
  properties?: { name: string; value: string }[]
  evidence?: {
    identity?: {
      field: string
      confidence: number
      methods: { technique: string; confidence: number; value: string }[]
    }
  }
}

export interface CycloneDXDependencyLink {
  ref: string
  dependsOn: string[]
}

export interface CycloneDXVulnerability {
  id: string
  source: { name: string; url?: string }
  ratings: { severity: string; score?: number; method?: string }[]
  description?: string
  recommendation?: string
  affects: { ref: string; versions?: { version: string; status: string }[] }[]
}

export interface CycloneDXSBOM {
  bomFormat: 'CycloneDX'
  specVersion: '1.5'
  serialNumber: string
  version: number
  metadata: {
    timestamp: string
    tools: { vendor: string; name: string; version: string }[]
    component: {
      type: 'application'
      name: string
      version?: string
      'bom-ref'?: string
    }
    properties?: { name: string; value: string }[]
  }
  components: CycloneDXComponent[]
  dependencies: CycloneDXDependencyLink[]
  vulnerabilities?: CycloneDXVulnerability[]
}

export interface SecurityAnalysisReport {
  summary: SecurityScanSummary
  findings: SecurityFinding[]
  dependencyPackages: DependencyPackage[]
  scannedFiles: string[]
  secretScanClean: boolean
  dependencyGraph?: DependencyGraphData
  sbom?: CycloneDXSBOM
  lockfileAmbiguities?: LockfileAmbiguity[]
}

export interface SASTRule {
  id: string
  name: string
  category: SecurityCategory
  severity: SecuritySeverity
  defaultConfidence: SecurityConfidence
  languages: ('javascript' | 'typescript' | 'python' | 'go' | 'rust' | 'java')[]
  description: string
  cwe: string
  owasp: string
  remediation: string
  limitations: string
  check: (fileContent: string, filePath: string, lines: string[]) => SecurityFinding[]
}
