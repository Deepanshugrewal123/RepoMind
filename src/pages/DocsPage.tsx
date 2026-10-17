import React from 'react'
import { Footer } from '../components/common/Footer'
import {
  Terminal,
  FileCode,
  Network,
  Cpu,
  CheckCircle2,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react'

export const DocsPage: React.FC = () => {
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
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sky-600 dark:text-sky-400 text-xs font-mono font-medium"
        >
          <Terminal className="w-4 h-4" />
          <span>TECHNICAL DOCUMENTATION & SPECS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight" style={{ color: 'var(--foreground)' }}>
          RepoMind Documentation
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Technical specifications for Knowledge Graph node/edge definitions, telemetry payload ingestion, and CI/CD pipeline triggers.
        </p>
      </section>

      {/* Docs Body */}
      <section className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        {/* Knowledge Graph Schema */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <Network className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              1. Software Knowledge Graph Schema
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            The knowledge graph stores vertices (nodes) and directed relationships (edges) synthesized during repository AST extraction.
          </p>

          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="rounded-2xl border p-4 font-mono text-xs overflow-x-auto"
          >
            <pre style={{ color: 'var(--foreground)' }}>{`// Node Schema
interface ComponentNode {
  id: string;               // e.g. "payment-service"
  name: string;             // Human-readable identifier
  type: "service" | "gateway" | "database" | "queue" | "external";
  language: string;         // "TypeScript", "Go", "Python"
  riskScore: number;        // Deterministic multi-factor score 0-100
  afferentCoupling: number; // Number of external components depending on this
  efferentCoupling: number; // Number of external components this depends on
  cyclomaticIndex: number;  // Average McCabe complexity index
  busFactor: number;        // Single maintainer concentration metric
}

// Edge Schema
interface ComponentEdge {
  source: string;           // Calling component ID
  target: string;           // Target dependency ID
  type: "sync_http" | "grpc" | "async_queue" | "sql_query";
  criticalPath: boolean;    // Is this along the synchronous user checkout path?
  p99LatencyMs: number;     // Monitored p99 latency
}`}</pre>
          </div>
        </div>

        {/* Telemetry Ingestion Payload */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              2. OpenTelemetry & Prometheus Ingestion
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            RepoMind accepts standard OTLP/gRPC spans and Prometheus gauge push metrics to correlate real-time anomalies with static code changes.
          </p>

          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="rounded-2xl border p-4 font-mono text-xs overflow-x-auto"
          >
            <pre style={{ color: 'var(--foreground)' }}>{`POST /api/v1/telemetry/spans
Content-Type: application/json

{
  "traceId": "tr-9941a",
  "serviceName": "PaymentService",
  "operation": "POST /internal/payment/settle",
  "durationMs": 6810,
  "status": "ERROR",
  "attributes": {
    "db.connection.pool_active": 98,
    "error.type": "LockAcquireTimeoutException",
    "deployment.commit": "e8a109f"
  }
}`}</pre>
          </div>
        </div>

        {/* GitHub Action Integration Snippet */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-teal-500" />
            <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
              3. CI/CD GitHub Action Setup
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            Add RepoMind risk regression checks to your repository's Pull Request pipeline to catch architectural coupling increases before merge.
          </p>

          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="rounded-2xl border p-4 font-mono text-xs overflow-x-auto"
          >
            <pre style={{ color: 'var(--foreground)' }}>{`# .github/workflows/repomind.yml
name: RepoMind Architecture & Risk Gate

on:
  pull_request:
    branches: [main]

jobs:
  repomind-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run RepoMind Software Intelligence
        uses: repomind/action@v2.8
        with:
          fail-on-risk-increase: true
          max-allowed-risk: 75
          generate-pr-summary: true`}</pre>
          </div>
        </div>

        {/* 4. Trustworthiness & Verification Scorecard */}
        <div 
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
          className="rounded-3xl border p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
                4. Trustworthiness & Verification Benchmark
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>18/18 INVARIANTS PASSED (100%)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            RepoMind subjects its graph algorithms, risk calculations, blast radius predictions, and causal DAGs to reproducible mathematical and empirical validation. Run the test suite directly with <code className="px-1.5 py-0.5 rounded bg-[var(--surface-interactive)] font-mono text-amber-500">npm run benchmark</code>.
          </p>

          {/* Capabilities Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                  <th className="py-2.5 px-3">CAPABILITY</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">METHODOLOGY</th>
                  <th className="py-2.5 px-3">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {[
                  { name: 'AST & Architectural Extraction', status: 'Fully implemented', method: 'Static AST & manifest lexical parsing', conf: 'Deterministic (100%)' },
                  { name: 'Coupling Analysis (Ca / Ce)', status: 'Fully implemented', method: "Robert C. Martin Instability I = Ce/(Ca+Ce)", conf: 'Deterministic (100%)' },
                  { name: 'Multi-Dimensional Risk Intelligence', status: 'Fully implemented', method: 'Calibrated composite multi-factor scoring', conf: 'Calibrated (92%)' },
                  { name: 'Incident Causality & OpenTelemetry DAG', status: 'Fully implemented', method: 'Telemetry anomaly & Git commit correlation', conf: 'Observed (96%)' },
                  { name: 'Blast Radius Prediction', status: 'Fully implemented', method: 'Transitive forward BFS cascade closure', conf: 'Deterministic (94%)' },
                  { name: 'Failure Simulation ("What-If?")', status: 'Fully implemented', method: 'Discrete-event topological fault injection', conf: 'Deterministic (100%)' },
                  { name: 'Automated Remediation Runbooks', status: 'Partially implemented', method: 'AST-safe decoupled transaction runbooks', conf: 'Calibrated (90%)' },
                  { name: 'Post-Incident Validation & Learning', status: 'Partially implemented', method: 'Pre/post risk delta delta verification', conf: 'Deterministic (100%)' },
                  { name: 'Engineering Fingerprint & Churn Analytics', status: 'Fully implemented', method: 'Git commit churn & bus factor profiling', conf: 'Deterministic (100%)' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[var(--surface-interactive)]">
                    <td className="py-2.5 px-3 font-semibold text-[var(--foreground)]">{row.name}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'Fully implemented'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--foreground-secondary)]">{row.method}</td>
                    <td className="py-2.5 px-3 text-[var(--muted-foreground)]">{row.conf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div 
            style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
            className="rounded-2xl border p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <span className="text-amber-500 font-bold block">$ npm run benchmark</span>
              <span className="text-[11px] text-[var(--muted-foreground)]">Executes 18 automated invariants across topology, coupling, DAG causality and blast radius in ~3ms.</span>
            </div>
            <a
              href="https://github.com/repomind/repomind/blob/main/benchmarks/SCORECARD.md"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--foreground)] hover:border-amber-500 transition-colors whitespace-nowrap text-center"
            >
              View Full SCORECARD.md ↗
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
