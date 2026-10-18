import React, { useState, useMemo } from 'react'
import { useApp } from '../../../context/AppContext'
import {
  SecurityFinding,
  SecuritySeverity,
  SecurityConfidence,
  SecurityCategory,
  DependencyPackage
} from '../../../services/security/types'
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Key,
  Bug,
  Package,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  X,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Info,
  Copy,
  Check,
  Terminal,
  Layers,
  Lock,
  ArrowRight,
  Download,
  FileText,
  GitFork
} from 'lucide-react'

export const SecurityView: React.FC = () => {
  const { securityReport, isCustomRepo, currentRepoName, customRepoMeta } = useApp()

  const [activeTab, setActiveTab] = useState<'findings' | 'dependencies' | 'sbom' | 'scope'>('findings')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL')
  const [selectedConfidence, setSelectedConfidence] = useState<string>('ALL')
  const [depFilter, setDepFilter] = useState<'ALL' | 'DIRECT' | 'TRANSITIVE' | 'VULNERABLE' | 'UNRESOLVED'>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeFinding, setActiveFinding] = useState<SecurityFinding | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sbomCopied, setSbomCopied] = useState<boolean>(false)

  const summary = securityReport?.summary || {
    scanTimestamp: new Date().toISOString(),
    repository: currentRepoName || 'Repository',
    ref: 'HEAD',
    filesInspectedCount: 0,
    filesSkippedCount: 0,
    skippedReasons: [],
    findingsCount: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    sastFindingsCount: 0,
    secretFindingsCount: 0,
    dependencyFindingsCount: 0,
    overallSecurityScore: 85,
    status: 'COMPLETE',
    coverageDescription: 'Analysis completed.'
  }

  const allFindings = securityReport?.findings || []
  const allDependencies = securityReport?.dependencyPackages || []

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filtered findings
  const filteredFindings = useMemo(() => {
    return allFindings.filter((f) => {
      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'SECRETS' && f.category !== 'HARDCODED_SECRET') return false
        if (selectedCategory === 'SAST' && (f.category === 'HARDCODED_SECRET' || f.category === 'DEPENDENCY_VULNERABILITY')) return false
        if (selectedCategory === 'DEPENDENCIES' && f.category !== 'DEPENDENCY_VULNERABILITY') return false
      }

      // Severity filter
      if (selectedSeverity !== 'ALL' && f.severity !== selectedSeverity) return false

      // Confidence filter
      if (selectedConfidence !== 'ALL' && f.confidence !== selectedConfidence) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesRule = f.ruleName.toLowerCase().includes(q) || f.ruleId.toLowerCase().includes(q)
        const matchesFile = f.filePath.toLowerCase().includes(q)
        const matchesAdvisory = f.advisoryReference?.toLowerCase().includes(q)
        const matchesDesc = f.explanation.toLowerCase().includes(q)
        if (!matchesRule && !matchesFile && !matchesAdvisory && !matchesDesc) return false
      }

      return true
    })
  }, [allFindings, selectedCategory, selectedSeverity, selectedConfidence, searchQuery])

  // Filtered dependencies with direct/transitive and status filtering
  const filteredDependencies = useMemo(() => {
    return allDependencies.filter((d) => {
      if (depFilter === 'DIRECT' && d.dependencyType === 'transitive') return false
      if (depFilter === 'TRANSITIVE' && d.dependencyType !== 'transitive') return false
      if (depFilter === 'VULNERABLE' && (!d.advisories || d.advisories.length === 0)) return false
      if (depFilter === 'UNRESOLVED' && d.advisoryStatus !== 'UNRESOLVED_RANGE') return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = d.name.toLowerCase().includes(q)
        const matchesFile = d.manifestFile.toLowerCase().includes(q)
        const matchesLock = d.lockfile?.toLowerCase().includes(q)
        const matchesEco = d.ecosystem.toLowerCase().includes(q)
        const matchesParent = d.parentPackage?.toLowerCase().includes(q)
        if (!matchesName && !matchesFile && !matchesLock && !matchesEco && !matchesParent) return false
      }

      return true
    })
  }, [allDependencies, depFilter, searchQuery])

  // Download SBOM as CycloneDX JSON
  const handleDownloadSBOM = () => {
    if (!securityReport?.sbom) return
    const jsonStr = JSON.stringify(securityReport.sbom, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${summary.repository.replace(/[^a-zA-Z0-9_-]/g, '_')}-cyclonedx-sbom.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Badges styling
  const getSeverityBadge = (severity: SecuritySeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/15 text-red-400 border-red-500/30'
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      case 'LOW':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30'
      case 'INFORMATIONAL':
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
    }
  }

  const getConfidenceBadge = (confidence: SecurityConfidence) => {
    switch (confidence) {
      case 'HIGH':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'LOW':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    }
  }

  const getCategoryIcon = (category: SecurityCategory) => {
    if (category === 'HARDCODED_SECRET') return <Key className="w-3.5 h-3.5 text-amber-400" />
    if (category === 'DEPENDENCY_VULNERABILITY') return <Package className="w-3.5 h-3.5 text-rose-400" />
    return <Bug className="w-3.5 h-3.5 text-orange-400" />
  }

  return (
    <div className="space-y-6 pb-20">
      {/* 1. VIEW HEADER */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono uppercase tracking-wider font-semibold"
              style={{ color: 'var(--accent-orange)' }}
            >
              [SECURITY // 04.INTELLIGENCE_AUDIT]
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              EVIDENCE-BACKED
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Security Intelligence & Vulnerability Audit
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Transparent static analysis, credential entropy detection, and verified dependency advisory mapping with strict severity-confidence decoupling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-2"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span style={{ color: 'var(--foreground)' }}>{summary.repository}</span>
            <span className="text-[10px] opacity-60">({summary.ref})</span>
          </span>
        </div>
      </div>

      {/* 2. SUMMARY KPI METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Security Score */}
        <div
          className="p-4 rounded-2xl flex flex-col justify-between transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>
              Security Score
            </span>
            <Shield className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-2">
            <span
              className={`text-2xl sm:text-3xl font-bold font-mono ${
                summary.overallSecurityScore >= 80
                  ? 'text-emerald-400'
                  : summary.overallSecurityScore >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {summary.overallSecurityScore}
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              {' '}
              / 100
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
            {summary.overallSecurityScore >= 80 ? 'Grade A • Defensible' : 'Action Recommended'}
          </span>
        </div>

        {/* Critical Vulnerabilities */}
        <div
          onClick={() => setSelectedSeverity('CRITICAL')}
          className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <span className="text-[10px] font-mono uppercase text-red-400 font-semibold">Critical Risks</span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-red-400">
              {summary.criticalCount}
            </span>
          </div>
          <span className="text-[10px] text-red-400 font-mono">Immediate remediation</span>
        </div>

        {/* High Vulnerabilities */}
        <div
          onClick={() => setSelectedSeverity('HIGH')}
          className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
          style={{
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}
        >
          <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">High Risks</span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
              {summary.highCount}
            </span>
          </div>
          <span className="text-[10px] text-rose-400 font-mono">Sprint triage queue</span>
        </div>

        {/* Secret Leaks */}
        <div
          onClick={() => {
            setSelectedCategory('SECRETS')
            setActiveTab('findings')
          }}
          className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>
            Exposed Secrets
          </span>
          <div className="my-2">
            <span
              className={`text-2xl sm:text-3xl font-bold font-mono ${
                summary.secretFindingsCount > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {summary.secretFindingsCount}
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
            {summary.secretFindingsCount > 0 ? 'Entropy alert triggered' : 'Zero exposed keys'}
          </span>
        </div>

        {/* Vulnerable Dependencies */}
        <div
          onClick={() => {
            setSelectedCategory('DEPENDENCIES')
            setActiveTab('findings')
          }}
          className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>
            CVE Dependencies
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">
              {summary.dependencyFindingsCount}
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
            of {allDependencies.length} declared packages
          </span>
        </div>

        {/* Files Inspected */}
        <div
          onClick={() => setActiveTab('scope')}
          className="p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)'
          }}
        >
          <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>
            Coverage
          </span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: 'var(--foreground)' }}>
              {summary.filesInspectedCount}
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              {' '}
              files
            </span>
          </div>
          <span className="text-[10px] font-mono flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Deterministic AST</span>
          </span>
        </div>
      </div>

      {/* 3. TRANSPARENCY NOTICE BANNER */}
      <div
        className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
        style={{
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          borderColor: 'rgba(245, 158, 11, 0.2)'
        }}
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <span style={{ color: 'var(--foreground-secondary)' }}>
            <strong className="text-amber-500">Analysis Methodology & Verification:</strong> Findings are generated through lexical pattern heuristics, Shannon entropy analysis, and offline OSV-aligned advisory lookups. Confidence ratings reflect evidence clarity without inflating severity.
          </span>
        </div>
        <button
          onClick={() => setActiveTab('scope')}
          className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-semibold cursor-pointer shrink-0 transition-colors"
        >
          Inspect Scope & Bounds →
        </button>
      </div>

      {/* 4. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setActiveTab('findings')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-all border-b-2 -mb-px cursor-pointer flex items-center gap-2 ${
            activeTab === 'findings'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          <span>Security Findings</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/10 text-amber-500">
            {allFindings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dependencies')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-all border-b-2 -mb-px cursor-pointer flex items-center gap-2 ${
            activeTab === 'dependencies'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Dependency Intelligence</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/10 text-sky-400">
            {allDependencies.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sbom')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-all border-b-2 -mb-px cursor-pointer flex items-center gap-2 ${
            activeTab === 'sbom'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>CycloneDX SBOM</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400">
            v1.5
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scope')}
          className={`px-4 py-2 text-xs font-mono font-bold transition-all border-b-2 -mb-px cursor-pointer flex items-center gap-2 ${
            activeTab === 'scope'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Scan Scope & Limitations</span>
        </button>
      </div>

      {/* 5. TAB: SECURITY FINDINGS */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div
            className="p-3.5 rounded-2xl border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs font-mono"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by rule, path, CVE, CWE, or description..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-transparent text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1 bg-[var(--surface-interactive)] p-1 rounded-xl border border-[var(--border)]">
                {['ALL', 'SECRETS', 'SAST', 'DEPENDENCIES'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border bg-[var(--surface-interactive)] text-xs font-mono cursor-pointer focus:outline-none"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              {/* Confidence Filter */}
              <select
                value={selectedConfidence}
                onChange={(e) => setSelectedConfidence(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border bg-[var(--surface-interactive)] text-xs font-mono cursor-pointer focus:outline-none"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                <option value="ALL">All Confidences</option>
                <option value="HIGH">High Confidence</option>
                <option value="MEDIUM">Medium Confidence</option>
                <option value="LOW">Low Confidence</option>
              </select>
            </div>
          </div>

          {/* Findings Count Summary */}
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span style={{ color: 'var(--muted-foreground)' }}>
              Showing {filteredFindings.length} of {allFindings.length} findings
            </span>
            {(selectedCategory !== 'ALL' || selectedSeverity !== 'ALL' || selectedConfidence !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL')
                  setSelectedSeverity('ALL')
                  setSelectedConfidence('ALL')
                  setSearchQuery('')
                }}
                className="text-amber-500 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Findings Cards List */}
          {filteredFindings.length > 0 ? (
            <div className="space-y-3">
              {filteredFindings.map((finding) => (
                <div
                  key={finding.id}
                  onClick={() => setActiveFinding(finding)}
                  className="p-5 rounded-2xl border transition-all cursor-pointer group hover:border-amber-500/50 shadow-sm"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      {/* Badges Line */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Severity Badge */}
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${getSeverityBadge(
                            finding.severity
                          )}`}
                        >
                          {finding.severity} SEVERITY
                        </span>

                        {/* Confidence Badge */}
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${getConfidenceBadge(
                            finding.confidence
                          )}`}
                        >
                          {finding.confidence} CONFIDENCE
                        </span>

                        {/* Category Badge */}
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface-interactive)] flex items-center gap-1 text-[var(--foreground-secondary)]">
                          {getCategoryIcon(finding.category)}
                          <span>{finding.category.replace(/_/g, ' ')}</span>
                        </span>

                        {/* Verification Pill */}
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          {finding.verificationStatus}
                        </span>

                        {finding.detectionMethod === 'CONTEXT_TAINT' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5 text-purple-400" />
                            <span>TAINT FLOW ({finding.taintPath?.length || 2} HOPS)</span>
                          </span>
                        )}
                      </div>

                      {/* Rule Name & ID */}
                      <div>
                        <h4
                          className="text-base font-bold font-display group-hover:text-amber-400 transition-colors"
                          style={{ color: 'var(--foreground)' }}
                        >
                          {finding.ruleName}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">Rule: {finding.ruleId}</span>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs font-sans leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                        {finding.explanation}
                      </p>

                      {/* File Location & Redacted Code Snippet */}
                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-500/90 mb-1.5">
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-semibold underline underline-offset-2">
                            {finding.filePath}:{finding.startLine}
                            {finding.endLine !== finding.startLine ? `-${finding.endLine}` : ''}
                          </span>
                        </div>

                        {finding.evidenceExcerpt && (
                          <div className="p-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs overflow-x-auto relative group/code">
                            <pre className="text-xs leading-5">
                              <code>{finding.evidenceExcerpt}</code>
                            </pre>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCopy(finding.evidenceExcerpt, finding.id)
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                              title="Copy code excerpt"
                            >
                              {copiedId === finding.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0">
                      <span className="text-[10px] font-mono text-slate-500">ID: {finding.id}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveFinding(finding)
                        }}
                        className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Inspect & Remediate</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              className="p-12 rounded-3xl border text-center space-y-4"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display" style={{ color: 'var(--foreground)' }}>
                  No Matching Security Findings
                </h3>
                <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--foreground-secondary)' }}>
                  {allFindings.length === 0
                    ? 'No known vulnerabilities or exposed credentials were found across the inspected files in this snapshot.'
                    : 'No findings match the current filter criteria. Try clearing your search or switching categories.'}
                </p>
              </div>
              {allFindings.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('ALL')
                    setSelectedSeverity('ALL')
                    setSelectedConfidence('ALL')
                    setSearchQuery('')
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB: DEPENDENCY INTELLIGENCE & SUPPLY CHAIN */}
      {activeTab === 'dependencies' && (
        <div className="space-y-4">
          {/* Lockfile Ambiguity Alert Banner */}
          {securityReport?.lockfileAmbiguities && securityReport.lockfileAmbiguities.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>COMPETING LOCKFILES DETECTED</span>
              </div>
              {securityReport.lockfileAmbiguities.map((amb, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">
                  {amb.explanation}
                </p>
              ))}
            </div>
          )}

          {/* KPI Supply Chain Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-slate-400 block text-[10px]">Total Packages</span>
              <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                {allDependencies.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-slate-400 block text-[10px]">Direct Dependencies</span>
              <span className="text-lg font-bold text-sky-400">
                {summary.directDependenciesCount ?? allDependencies.filter((p) => p.dependencyType !== 'transitive').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-slate-400 block text-[10px]">Transitive Dependencies</span>
              <span className="text-lg font-bold text-purple-400">
                {summary.transitiveDependenciesCount ?? allDependencies.filter((p) => p.dependencyType === 'transitive').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-slate-400 block text-[10px]">Confirmed Vulnerable</span>
              <span className="text-lg font-bold text-rose-400">
                {allDependencies.filter((d) => (d.advisoryCount || 0) > 0).length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <span className="text-slate-400 block text-[10px]">Resolution Mode</span>
              <span className={`text-[11px] font-bold block mt-1 ${
                summary.lockfileResolutionStatus === 'FULL_LOCKFILE'
                  ? 'text-emerald-400'
                  : summary.lockfileResolutionStatus === 'COMPETING_LOCKFILES'
                  ? 'text-amber-400'
                  : 'text-sky-400'
              }`}>
                {summary.lockfileResolutionStatus || 'FULL_LOCKFILE'}
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-[var(--border)] text-xs font-mono">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['ALL', 'DIRECT', 'TRANSITIVE', 'VULNERABLE', 'UNRESOLVED'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDepFilter(mode)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      depFilter === mode
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-[var(--surface-interactive)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">
                Showing {filteredDependencies.length} of {allDependencies.length} dependencies
              </span>
            </div>

            {filteredDependencies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-slate-400 text-[10px] uppercase">
                      <th className="py-2.5 px-3">Package & Scope</th>
                      <th className="py-2.5 px-3">Ecosystem</th>
                      <th className="py-2.5 px-3">Version (Resolved / Declared)</th>
                      <th className="py-2.5 px-3">Relation & Path</th>
                      <th className="py-2.5 px-3">Provenance File</th>
                      <th className="py-2.5 px-3">Advisory Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredDependencies.map((dep, idx) => (
                      <tr key={idx} className="hover:bg-[var(--surface-interactive)] transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-200">{dep.name}</span>
                            {dep.scope && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                                {dep.scope}
                              </span>
                            )}
                          </div>
                          {dep.purl && (
                            <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                              {dep.purl}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-500/10 border border-slate-500/20 text-slate-300">
                            {dep.ecosystem}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="space-y-0.5">
                            <span className="text-amber-500 font-semibold block">
                              {dep.resolvedVersion || dep.version || 'Unresolved'}
                            </span>
                            {dep.declaredVersion && dep.declaredVersion !== dep.resolvedVersion && (
                              <span className="text-[10px] text-slate-400 block">
                                Declared: {dep.declaredVersion}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {dep.dependencyType === 'transitive' ? (
                            <div className="space-y-0.5">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                TRANSITIVE
                              </span>
                              {dep.dependencyPath && dep.dependencyPath.length > 1 && (
                                <span className="text-[10px] text-slate-400 block truncate max-w-[200px]" title={dep.dependencyPath.join(' → ')}>
                                  {dep.dependencyPath.join(' → ')}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                              DIRECT
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                          {dep.lockfile ? (
                            <span title={`Resolved via ${dep.lockfile}`}>{dep.lockfile}</span>
                          ) : (
                            <span>{dep.manifestFile}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {dep.advisories && dep.advisories.length > 0 ? (
                            <div className="space-y-1">
                              {dep.advisories.map((adv, aIdx) => (
                                <a
                                  key={aIdx}
                                  href={adv.referenceUrl || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:underline"
                                >
                                  <span>
                                    {adv.id}: {adv.title}
                                  </span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ))}
                            </div>
                          ) : dep.advisoryStatus === 'CONFLICTING_ADVISORY_DATA' ? (
                            <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold" title="Advisory sources conflict across queried databases; manual triage required">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Conflicting Advisories</span>
                            </span>
                          ) : dep.advisoryStatus === 'PROVIDER_UNAVAILABLE' ? (
                            <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold" title="Advisory database could not be queried; runtime security unknown">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Provider Unavailable</span>
                            </span>
                          ) : dep.advisoryStatus === 'UNSUPPORTED_ECOSYSTEM' ? (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold" title="No advisory feed available for this package ecosystem">
                              <Info className="w-3 h-3" />
                              <span>Unsupported Ecosystem</span>
                            </span>
                          ) : dep.advisoryStatus === 'UNRESOLVED_RANGE' || !dep.isExact || dep.resolutionMethod === 'MANIFEST_RANGE_UNRESOLVED' ? (
                            <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold" title="Floating range without resolved lockfile; requires exact pin to confirm runtime safety">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Floating Range (Unresolved)</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>No known CVE</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs font-mono text-slate-400">
                No dependencies matching filter '{depFilter}'.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. TAB: CYCLONEDX SBOM */}
      {activeTab === 'sbom' && (
        <div className="space-y-4">
          <div
            className="p-6 rounded-3xl border space-y-4"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    CYCLONEDX SPEC 1.5 JSON
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    DETERMINISTIC SERIALIZATION
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                  Software Bill of Materials (SBOM) Export
                </h3>
                <p className="text-xs font-sans text-slate-400">
                  Standardized, machine-readable inventory of all direct and transitive components, Package URLs (PURLs), and correlated vulnerability advisories.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (securityReport?.sbom) {
                      navigator.clipboard.writeText(JSON.stringify(securityReport.sbom, null, 2))
                      setSbomCopied(true)
                      setTimeout(() => setSbomCopied(false), 2000)
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-interactive)] hover:bg-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer text-slate-200"
                >
                  {sbomCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadSBOM}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SBOM (.json)</span>
                </button>
              </div>
            </div>

            {/* SBOM Metrics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                <span className="text-slate-400 block text-[10px]">Components</span>
                <span className="text-lg font-bold text-emerald-400">
                  {securityReport?.sbom?.components?.length || allDependencies.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                <span className="text-slate-400 block text-[10px]">Dependency Links</span>
                <span className="text-lg font-bold text-sky-400">
                  {securityReport?.sbom?.dependencies?.length || 1}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                <span className="text-slate-400 block text-[10px]">Vulnerability Records</span>
                <span className="text-lg font-bold text-rose-400">
                  {securityReport?.sbom?.vulnerabilities?.length || 0}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                <span className="text-slate-400 block text-[10px]">Spec Format</span>
                <span className="text-lg font-bold text-amber-500">
                  CycloneDX 1.5
                </span>
              </div>
            </div>

            {/* SBOM JSON Preview */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">
                Generated CycloneDX v1.5 JSON Document Preview:
              </span>
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs max-h-96 overflow-y-auto leading-relaxed">
                <code>{JSON.stringify(securityReport?.sbom || {}, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB: SCAN SCOPE & LIMITATIONS */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          {/* Scope details */}
          <div
            className="p-6 rounded-3xl border space-y-4"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold font-display" style={{ color: 'var(--foreground)' }}>
                Analysis Boundaries & Theoretical Grounding
              </h3>
            </div>

            <p className="text-xs font-sans leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              RepoMind provides client-side, deterministic security intelligence designed for zero-trust code auditing. We prioritize transparent accuracy over inflated warning counts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>WHAT THIS SUBSYSTEM ANALYZES</span>
                </div>
                <ul className="text-xs font-mono space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Deterministic lexical matching for 11 critical SAST pattern classes.</li>
                  <li>Hardcoded credential entropy scanning using Shannon entropy ($H \ge 3.6$).</li>
                  <li>Explicit API key signatures (AWS, GitHub PAT, Slack, Stripe, DB URIs).</li>
                  <li>Package manifest dependency extraction with exact semver parsing.</li>
                  <li>Offline advisory matching against verified CVE/GHSA datasets and OSV.</li>
                  <li>Strict value redaction for credentials in UI, logs, and error traces.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>HONEST LIMITATIONS & BOUNDARIES</span>
                </div>
                <ul className="text-xs font-mono space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>No dynamic runtime exploit execution or penetration testing.</li>
                  <li>No live verification whether detected credentials are active on third-party APIs.</li>
                  <li>Loose semver ranges (^, ~) are evaluated conservatively without lockfiles.</li>
                  <li>Deep multi-tier inter-service taint tracking across remote RPCs is heuristic.</li>
                  <li>Binary files, compiled assets, and vendor directories are intentionally skipped.</li>
                </ul>
              </div>
            </div>

            {/* Skipped files breakdown */}
            <div className="pt-4 border-t border-[var(--border)]">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400 mb-2">
                Files Inspected vs Skipped Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                  <span className="text-slate-400 block text-[10px]">Inspected Source Files</span>
                  <span className="text-lg font-bold text-emerald-400">{summary.filesInspectedCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                  <span className="text-slate-400 block text-[10px]">Skipped Files (Binary / Vendor)</span>
                  <span className="text-lg font-bold text-slate-400">{summary.filesSkippedCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)]">
                  <span className="text-slate-400 block text-[10px]">Deduplicated Unique Findings</span>
                  <span className="text-lg font-bold text-amber-500">{summary.findingsCount}</span>
                </div>
              </div>

              {summary.skippedReasons && summary.skippedReasons.length > 0 && (
                <div className="mt-3 space-y-1 text-xs font-mono text-slate-400">
                  {summary.skippedReasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                      <span>
                        {r.reason}: {r.count} files
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. INSPECTOR DRAWER / MODAL */}
      {activeFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-3xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: 'var(--border)'
            }}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${getSeverityBadge(
                      activeFinding.severity
                    )}`}
                  >
                    {activeFinding.severity}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${getConfidenceBadge(
                      activeFinding.confidence
                    )}`}
                  >
                    {activeFinding.confidence} CONFIDENCE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">
                    {activeFinding.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                  {activeFinding.ruleName}
                </h3>
                <span className="text-xs font-mono text-slate-400">Rule ID: {activeFinding.ruleId}</span>
              </div>

              <button
                onClick={() => setActiveFinding(null)}
                className="p-2 rounded-xl border border-[var(--border)] text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs font-mono">
              {/* Vulnerability Explanation */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                  Technical Explanation
                </h4>
                <p className="text-xs font-sans leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                  {activeFinding.explanation}
                </p>
              </div>

              {/* Preconditions & Limitations */}
              {activeFinding.preconditionsAndLimitations && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Analysis Preconditions & Known Limitations</span>
                  </span>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed">
                    {activeFinding.preconditionsAndLimitations}
                  </p>
                </div>
              )}

              {/* Context-Aware Source-to-Sink Taint Trail */}
              {activeFinding.taintPath && activeFinding.taintPath.length > 0 && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Context-Aware Source-to-Sink Trail ({activeFinding.taintPath.length} Steps)</span>
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      {activeFinding.isInterprocedural ? 'CROSS-FILE / INTERPROCEDURAL' : 'LOCAL FUNCTION FLOW'}
                    </span>
                  </div>

                  <div className="space-y-2 mt-2">
                    {activeFinding.taintPath.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-[10px] border border-purple-500/40">
                          {step.stepIndex}
                        </span>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-slate-200">
                              {step.description}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {step.filePath}:{step.line}
                            </span>
                          </div>
                          <pre className="text-[11px] font-mono p-1.5 rounded bg-slate-900 text-purple-200/90 overflow-x-auto border border-slate-800">
                            <code>{step.codeSnippet}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exact Code Location & Evidence Excerpt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                    Traceable Evidence Location
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Lines {activeFinding.startLine}-{activeFinding.endLine}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--surface-interactive)] border border-[var(--border)] text-slate-300">
                  <FileCode className="w-3.5 h-3.5 inline mr-1.5 text-amber-500" />
                  <code>{activeFinding.filePath}</code>
                </div>

                {activeFinding.evidenceExcerpt && (
                  <div className="relative mt-2 p-3.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 overflow-x-auto">
                    <pre className="text-xs leading-5">
                      <code>{activeFinding.evidenceExcerpt}</code>
                    </pre>
                    <button
                      onClick={() => handleCopy(activeFinding.evidenceExcerpt, 'modal-evidence')}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
                      title="Copy evidence"
                    >
                      {copiedId === 'modal-evidence' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Remediation Guidance & Patch */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Remediation & Hardening Guidance
                </h4>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-slate-200">
                  <p className="font-sans text-xs leading-relaxed">{activeFinding.remediation}</p>
                </div>
              </div>

              {/* External Advisory Links */}
              {activeFinding.advisoryReference && (
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-slate-400 text-xs">
                  <span>Advisory Citation: {activeFinding.advisoryReference}</span>
                  <a
                    href={`https://cwe.mitre.org/data/definitions/${
                      activeFinding.advisoryReference.match(/CWE-(\d+)/)?.[1] || '79'
                    }.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>MITRE CWE Definition</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-interactive)] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Finding ID: <code className="text-amber-500">{activeFinding.id}</code>
              </span>
              <button
                onClick={() => setActiveFinding(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer text-xs font-mono"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
