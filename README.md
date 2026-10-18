# RepoMind — AI Software Intelligence & Reliability Platform

> **"Understand your software. Before it breaks."**

RepoMind is a production-grade Software Intelligence and Reliability Platform engineered to bridge the gap between static codebase architecture and runtime observability. It continuously analyzes repository ASTs, maps dependency blast radiuses, investigates production incidents with cross-layer telemetry correlation, recommends evidence-backed remediation, and validates post-fix risk reduction through closed-loop learning.

---

## 🌟 Core Architecture & Capabilities

```text
Repository AST
      ↓
Architecture & Dependency Graph (CodeDNA Layer)
      ↓
Predictive Risk Scoring & Blast Radius (Autopsy Layer)
      ↓
Telemetry Correlation & Incident Room (IncidentAI Layer)
      ↓
Causal Root Cause DAG & Counterfactual Rollback
      ↓
Evidence-Backed Remediation & Code Patch Diffs (Resolve Layer)
      ↓
Post-Fix Differential Validation
      ↓
Closed-Loop Continuous Learning
```

### 1. The 6-Stage Intelligence Lifecycle
- **Understand:** AST extraction, static call-graph synthesis, dependency concentration, and framework parsing.
- **Predict:** Multi-dimensional risk vectors (Architecture, Scalability, Reliability, Security, Maintainability, Bus Factor, Technical Debt).
- **Investigate:** Cross-layer correlation linking Git commits and deployments to runtime metrics, connection pool saturation, and OpenTelemetry spans.
- **Resolve:** Prioritized action plans with reviewable, side-by-side Git patch diffs.
- **Validate:** Differential Before vs After verification (e.g. Risk Score: 91 ➔ 67, DB Connection Hold: 1,420ms ➔ 5.8ms).
- **Learn:** Automated synthesis of CI linter guardrails to prevent identical failure modes.

### 2. Primary Visual & Interaction Highlights
- **Reactive Intelligence Field:** Canvas-based topological grid distortion reacting physically to cursor coordinates with organic amber and emerald liquid currents (zero generic starfields or AI dot networks).
- **Cinematic Product Showcase:** Spatial 3D frame inspired by modern editorial SaaS design with technical corner crosshairs (`+`), coordinate stamps, and `+ AUTO EXPLORE` / `|| PAUSE EXPERIENCE` controls.
- **Evidence-First UX:** Clear separation between **Observed Evidence** (telemetry ground truth), **Deterministic Analysis** (AST & graph theory), and **AI Inference** (with explicit confidence scores).
- **Global Command Palette (`Ctrl/Cmd + K`):** Fuzzy search across components, risks, incidents, and navigation shortcuts.
- **Context-Aware AI Assistant (`✦ Ask RepoMind`):** Dynamic prompts and answers attuned to the active component and view.
- **Interactive "What If?" Simulation:** Real-time blast radius ripple and step-by-step failure propagation across microservices.
- **Focus Mode:** Distraction-free immersive view for Knowledge Graph and Incident War Room.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling & Design System:** Tailwind CSS v4 + Custom Liquid Glass Panels + Technical Spatial Frames
- **Animations & Micro-Interactions:** Custom requestAnimationFrame topological physics, Framer Motion, and Liquid Magnetic button dynamics
- **Icons:** Lucide Icons & Custom SVG Vector Glyphs
- **Validation Engine:** Canvas Confetti celebration + Differential metric calculation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Local Development
```bash
# Clone the repository
git clone https://github.com/cloud-mesh/repomind.git
cd repomind

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle (TypeScript strict checks + Vite)
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Comprehensive Verification & Test Suites

RepoMind includes 10 automated regression gates covering architectural integrity, lexical SAST, context-aware taint tracking, adversarial security vectors, dependency intelligence, multi-ecosystem corpus validation, supply-chain parser hardening, and standards conformance.

```bash
# 1. Execute core system integrity benchmark (18 invariant tests)
npm run benchmark

# 2. Execute evidence-based security & secret detection benchmark (40 ground-truth vectors)
npm run test:security

# 3. Execute repository ingestion & lexical AST parser tests (5 checks)
node tests/repoAnalysisService.test.js

# 4. Execute context-aware source-to-sink taint analysis suite (14 checks)
npm run test:taint

# 5. Execute adversarial security evasion & sanitizer trap suite (16 vectors)
npm run test:adversarial

# 6. Execute lockfile-aware dependency intelligence & versioning tests (27 checks)
npm run test:dependencies

# 7. Execute multi-ecosystem corpus validation across 8 repositories (32 vectors)
npm run validate:corpus

# 8. Execute supply-chain parser hardening & boundary exclusion tests (28 checks)
npm run test:supply-chain

# 9. Execute standards conformance & CycloneDX v1.5 JSON differential tests (37 checks)
npm run test:standards
```

---

## 🌐 Supported Languages & Dependency Manifests

RepoMind performs 100% client-side deterministic static analysis directly within browser memory:

| Category | Supported Formats / Languages |
| :--- | :--- |
| **Source Languages (AST Import Extraction)** | TypeScript (`.ts`, `.tsx`), JavaScript (`.js`, `.jsx`, `.mjs`, `.cjs`), Python (`.py`), Go (`.go`), Java (`.java`) |
| **Dependency Manifests & Lockfiles** | `package.json`, `package-lock.json`, `npm-shrinkwrap.json`, `yarn.lock`, `pnpm-lock.yaml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml` |
| **Version Specification Standards** | SemVer 2.0.0 (npm, Cargo, Go), PEP 440 (PyPI), Maven 3 qualifiers (Java) |
| **Security Standards & SBOM** | CycloneDX v1.5 JSON with Package URLs (PURLs), RFC 4122 UUID serials, and referential dependency graphs |

---

## ⚖️ Architectural Boundaries: Live Client-Side vs. Demonstration Workflows

To ensure strict engineering honesty, RepoMind explicitly separates what executes deterministically in your browser from what requires external production infrastructure:

- **Client-Side Deterministic Analysis:** AST import extraction, module topology clustering, Martin instability metrics ($I = C_e / (C_a + C_e)$), reverse-graph BFS blast radius calculation, lexical SAST rule matching, Shannon entropy secret detection, dependency resolution, and CycloneDX v1.5 SBOM generation execute entirely in client-side memory.
- **Demonstration / Infrastructure-Dependent Workflows:** Failure simulations (`SimulationView`), live APM telemetry traces (`IncidentsView`), causal anomaly correlation (`RootCauseView`), code patch writing (`RemediationView`), closed-loop test execution (`ValidationView`), and 180-day commit discipline analysis (`AnalyticsView`) are demonstrated using the verified `CheckoutPlatform-v2.8` reference dataset. For custom repositories, these views display explicit technical notices indicating that an external eBPF sidecar, OpenTelemetry collector, CI/CD runner, or Git write agent is required.

---

## 🔒 Security, Privacy & Token Boundaries

- **Zero Persistent Code Storage:** Repositories are analyzed in ephemeral, isolated browser memory. Raw source code files are purged after AST synthesis; only structural metadata and graph relationships are maintained.
- **Client-Side & Read-Only:** Ingestion requires strictly read-only permissions (`contents:read`, `metadata:read`). Code is never transmitted to external servers or used to train public AI foundation models.
- **Token Protection:** Optional GitHub Personal Access Tokens (used to increase API rate limits to 5,000 req/hr) are stored strictly in volatile React component state. They are never written to `localStorage`, never logged, and automatically redacted in error diagnostics.

---

## 📋 Release Status & Defect Reporting

- **Current Version:** `v2.8-preview` (Production Preview State)
- **Status:** Evaluated across 217 automated verification invariants with zero P0/P1 defects.
- **Reporting Issues:** Please report any reproducible bugs, unsupported syntax constructs, or false positives with reproduction steps and target repository manifests.

---

© RepoMind. Operating intelligence layer for modern engineering teams.
