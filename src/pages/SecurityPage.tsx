import React from 'react'
import { Footer } from '../components/common/Footer'
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Key,
  Server
} from 'lucide-react'

export const SecurityPage: React.FC = () => {
  return (
    <div 
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)'
      }}
      className="min-h-screen pt-28 transition-colors"
    >
      {/* Header */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-12 border-b text-center space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>TRANSPARENCY & DATA HANDLING</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          Security, Privacy & Trust
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          An honest, technical explanation of how RepoMind inspects code, handles telemetry, separates deterministic analysis from AI inference, and protects your intellectual property.
        </p>

        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
          className="max-w-2xl mx-auto p-3.5 rounded-2xl border text-xs font-mono text-left space-y-1"
        >
          <div className="font-bold text-amber-500 flex items-center gap-1.5">
            <span>ℹ Architecture Specification & Client Demo Notice:</span>
          </div>
          <p style={{ color: 'var(--muted-foreground)' }}>
            This live demonstration executes client-side in your browser. Target compliance frameworks (SOC 2 Type II readiness, isolated memory worker clusters) describe the production server architecture specified for enterprise on-premise and VPC deployments.
          </p>
        </div>
      </section>

      {/* Main Principles */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        {/* Zero Persistent Code Storage */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              Zero Persistent Code Storage
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            RepoMind analyzes code repositories in ephemeral, isolated memory containers. Once the Abstract Syntax Tree (AST) and topological knowledge graph are synthesized, raw source code files are purged from disk. Only structural metadata (identifiers, function signatures, import relationships) is retained in the graph.
          </p>
          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="p-3.5 rounded-xl border text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-medium"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Source code is never used to train public foundation models.</span>
          </div>
        </div>

        {/* Deterministic Analysis vs AI Inference */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              Deterministic AST vs AI Inference
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            We explicitly separate mathematical ground truth from AI recommendations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
            <div 
              style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
              className="p-4 rounded-xl border space-y-1.5"
            >
              <div className="font-bold text-amber-500">Deterministic Calculations:</div>
              <ul className="space-y-1 text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                <li>• Cyclomatic complexity counts</li>
                <li>• Import call hierarchies & coupling indices</li>
                <li>• Prometheus metric threshold anomalies</li>
                <li>• Git commit frequencies & author churn</li>
              </ul>
            </div>

            <div 
              style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
              className="p-4 rounded-xl border space-y-1.5"
            >
              <div className="font-bold text-emerald-600 dark:text-emerald-400">AI Inferences (With Confidence Scores):</div>
              <ul className="space-y-1 text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>
                <li>• Probable incident root cause synthesis</li>
                <li>• Natural-language remediation explanations</li>
                <li>• Proposed code patch diffs</li>
                <li>• Failure cascade probability predictions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Read-Only Ingestion Permissions */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              Read-Only Permissions & Auditability
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            RepoMind requires strictly <strong>read-only</strong> repository access (contents:read, metadata:read). RepoMind cannot push commits or modify production repositories directly without explicit human export and developer pull request approval.
          </p>
          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
            <span style={{ color: 'var(--foreground-secondary)' }}>Every analysis action and suggestion is logged with a cryptographic SHA-256 trace.</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
