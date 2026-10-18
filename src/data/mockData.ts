// Rich domain datasets for RepoMind - Software Intelligence & Reliability Platform

export interface ComponentNode {
  id: string
  name: string
  type: 'service' | 'gateway' | 'database' | 'queue' | 'external' | 'cache'
  language: string
  framework: string
  riskScore: number // 0 - 100
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  loc: number
  churnRate: string // e.g. "+34% this month"
  dependenciesCount: number
  dependentsCount: number
  busFactor: number
  leadMaintainer: string
  healthStatus: 'healthy' | 'warning' | 'critical'
  layer: 'frontend' | 'gateway' | 'service' | 'data' | 'external'
  description: string
  x?: number
  y?: number
  instabilityScore?: number
  isObserved?: boolean
  filesCount?: number
  files?: string[]
}

export interface ComponentEdge {
  source: string
  target: string
  type: 'sync_http' | 'grpc' | 'async_queue' | 'sql_query' | 'cache_lookup' | 'static_import' | 'module_import'
  latencyMs?: number
  callVolume?: string
  criticalPath: boolean
  evidence?: any
  isObserved?: boolean
}

export interface RiskItem {
  id: string
  componentId: string
  componentName: string
  title: string
  category: 'Architecture' | 'Reliability' | 'Scalability' | 'Security' | 'Maintainability' | 'Bus Factor' | 'Technical Debt'
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  score: number // 0-100
  confidence: number // percentage e.g. 92
  detectedAt: string
  summary: string
  evidence: {
    observed: string[]
    deterministic: string[]
    inference: string[]
  }
  potentialImpact: string
  remediationSummary: string
  relatedFiles: string[]
  relatedIncidents: string[]
}

export interface IncidentRecord {
  id: string
  title: string
  status: 'ACTIVE' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED'
  severity: 'P0' | 'P1' | 'P2'
  startedAt: string
  duration: string
  primaryComponent: string
  rootCauseSummary: string
  confidence: number
  timeline: {
    time: string
    title: string
    type: 'deployment' | 'metric_anomaly' | 'alert' | 'log_error' | 'user_impact'
    description: string
    meta?: string
  }[]
  metrics: {
    timestamp: string
    latencyMs: number
    errorRatePercent: number
    activeConnections: number
    cpuPercent: number
  }[]
  correlatedCommit: {
    hash: string
    author: string
    message: string
    changedFiles: number
    prNumber: number
  }
  traces: {
    traceId: string
    span: string
    durationMs: number
    status: 'ok' | 'error'
    errorDetail?: string
  }[]
}

export interface SimulationScenario {
  id: string
  title: string
  description: string
  trigger: string
  affectedServices: string[]
  blastRadiusPercent: number
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  confidence: number
  propagationSteps: {
    step: number
    component: string
    symptom: string
    delayMs: number
  }[]
  recommendation: string
}

export interface RemediationPlan {
  id: string
  riskId: string
  componentId: string
  componentName: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  title: string
  problemDescription: string
  rootCauseAnalysis: string
  effort: 'Low' | 'Medium' | 'High'
  impact: 'High' | 'Very High' | 'Critical'
  steps: string[]
  codePatch: {
    file: string
    language: string
    beforeCode: string
    afterCode: string
    explanation: string
  }
  validationMetrics: {
    metric: string
    before: string | number
    after: string | number
    improvement: string
  }[]
  preventiveMeasures: string[]
}

// Sample System: E-Commerce Microservices Platform ("CheckoutPlatform-v2.8")
export const SYSTEM_HEALTH_METRICS = {
  overallScore: 72,
  criticalRisks: 3,
  activeIncidents: 1,
  highRiskComponents: 7,
  dependencyHotspots: 5,
  recommendedActions: 4,
  categories: [
    { name: 'Architecture', score: 72, trend: '-4 pts', status: 'warning', description: 'Excessive coupling in payment and order routing' },
    { name: 'Security', score: 84, trend: '+2 pts', status: 'healthy', description: 'Zero exposed secrets; TLS 1.3 enforced' },
    { name: 'Reliability', score: 58, trend: '-9 pts', status: 'critical', description: 'Missing circuit breaker on external Stripe client' },
    { name: 'Scalability', score: 46, trend: '-12 pts', status: 'critical', description: 'Database connection pool saturation under 3x load' },
    { name: 'Maintainability', score: 67, trend: '+1 pt', status: 'warning', description: 'High cyclomatic complexity in order calculation logic' },
    { name: 'Bus Factor', score: 31, trend: '-5 pts', status: 'critical', description: 'Auth & billing modules authored by single contributor' },
    { name: 'Technical Debt', score: 67, trend: '-3 pts', status: 'warning', description: '19 pending TODOs in payment checkout retry engine' }
  ]
}

export const WHAT_CHANGED_DATA = {
  commitRange: 'HEAD~8...HEAD (v2.8.4 -> v2.8.5)',
  analyzedAt: 'Just now',
  stats: [
    { label: 'Files Modified', value: '+17 files', type: 'neutral' },
    { label: 'Dependencies Added', value: '+2 external libs', type: 'warning' },
    { label: 'Critical Risk', value: '+1 risk escalated', type: 'critical' },
    { label: 'Technical Debt', value: '-3 issues resolved', type: 'positive' },
    { label: 'Test Coverage', value: '+8% on order core', type: 'positive' }
  ],
  recentCommits: [
    { hash: 'e8a109f', author: 'd.verma', message: 'perf(payment): rewrite transaction settlement loop', date: '2 hours ago', riskImpact: 'HIGH' },
    { hash: '4f29a0b', author: 'm.chen', message: 'feat(cart): implement instant discount voucher engine', date: '5 hours ago', riskImpact: 'MEDIUM' },
    { hash: 'c9118d2', author: 's.patel', message: 'fix(auth): refresh token expiry skew tolerance', date: '1 day ago', riskImpact: 'LOW' }
  ]
}

export const COMPONENTS_DATA: ComponentNode[] = [
  {
    id: 'api-gateway',
    name: 'APIGateway',
    type: 'gateway',
    language: 'Go / Envoy',
    framework: 'Envoy Proxy 1.29',
    riskScore: 38,
    criticality: 'LOW',
    loc: 4800,
    churnRate: '+8% this month',
    dependenciesCount: 4,
    dependentsCount: 1,
    busFactor: 3,
    leadMaintainer: 'Sarah Lin',
    healthStatus: 'healthy',
    layer: 'gateway',
    description: 'Edge reverse proxy, SSL termination, and token validation routing.'
  },
  {
    id: 'payment-service',
    name: 'PaymentService',
    type: 'service',
    language: 'TypeScript / Node.js',
    framework: 'NestJS 10.3',
    riskScore: 91,
    criticality: 'CRITICAL',
    loc: 18450,
    churnRate: '+64% this month',
    dependenciesCount: 11,
    dependentsCount: 14,
    busFactor: 1,
    leadMaintainer: 'Devon Vance (Single Contributor)',
    healthStatus: 'critical',
    layer: 'service',
    description: 'Central transaction orchestration, external gateway calls, and ledger settlement.'
  },
  {
    id: 'order-service',
    name: 'OrderService',
    type: 'service',
    language: 'Go',
    framework: 'Gin 1.9',
    riskScore: 78,
    criticality: 'HIGH',
    loc: 24200,
    churnRate: '+41% this month',
    dependenciesCount: 8,
    dependentsCount: 9,
    busFactor: 2,
    leadMaintainer: 'Aiden Brooks',
    healthStatus: 'warning',
    layer: 'service',
    description: 'Cart-to-order lifecycle, discount calculations, inventory hold leases.'
  },
  {
    id: 'inventory-service',
    name: 'InventoryService',
    type: 'service',
    language: 'Python',
    framework: 'FastAPI 0.110',
    riskScore: 44,
    criticality: 'MEDIUM',
    loc: 11200,
    churnRate: '+12% this month',
    dependenciesCount: 4,
    dependentsCount: 6,
    busFactor: 2,
    leadMaintainer: 'Elena Rostova',
    healthStatus: 'healthy',
    layer: 'service',
    description: 'SKU warehouse reservations, backorder tracking, and fulfillment sync.'
  },
  {
    id: 'auth-service',
    name: 'AuthService',
    type: 'service',
    language: 'Go',
    framework: 'Go 1.22 Crypto',
    riskScore: 65,
    criticality: 'HIGH',
    loc: 9600,
    churnRate: '+15% this month',
    dependenciesCount: 3,
    dependentsCount: 12,
    busFactor: 1,
    leadMaintainer: 'Sarah Lin',
    healthStatus: 'warning',
    layer: 'service',
    description: 'OAuth2/OIDC provider, JWT signing keys, and RBAC policy evaluation.'
  },
  {
    id: 'postgres-db',
    name: 'PostgresPrimary',
    type: 'database',
    language: 'SQL',
    framework: 'PostgreSQL 16.2',
    riskScore: 82,
    criticality: 'CRITICAL',
    loc: 3200,
    churnRate: '+22% queries added',
    dependenciesCount: 0,
    dependentsCount: 7,
    busFactor: 2,
    leadMaintainer: 'DBA Ops Team',
    healthStatus: 'warning',
    layer: 'data',
    description: 'Relational data store for transactions, ledger entries, and customer accounts.'
  },
  {
    id: 'redis-cache',
    name: 'RedisCluster',
    type: 'cache',
    language: 'C',
    framework: 'Redis 7.2',
    riskScore: 28,
    criticality: 'LOW',
    loc: 500,
    churnRate: 'Stable',
    dependenciesCount: 0,
    dependentsCount: 5,
    busFactor: 3,
    leadMaintainer: 'Infra Team',
    healthStatus: 'healthy',
    layer: 'data',
    description: 'Distributed session storage, rate limit sliding windows, price quote caching.'
  },
  {
    id: 'kafka-bus',
    name: 'KafkaEventStream',
    type: 'queue',
    language: 'Java / Scala',
    framework: 'Apache Kafka 3.7',
    riskScore: 35,
    criticality: 'MEDIUM',
    loc: 1400,
    churnRate: 'Stable',
    dependenciesCount: 0,
    dependentsCount: 8,
    busFactor: 2,
    leadMaintainer: 'Platform Team',
    healthStatus: 'healthy',
    layer: 'data',
    description: 'Async message broker for invoice dispatch, order status events, and analytics.'
  },
  {
    id: 'stripe-client',
    name: 'StripePaymentAPI',
    type: 'external',
    language: 'HTTP/REST',
    framework: 'Stripe v2024-04',
    riskScore: 74,
    criticality: 'CRITICAL',
    loc: 850,
    churnRate: '+5% SDK update',
    dependenciesCount: 0,
    dependentsCount: 1,
    busFactor: 4,
    leadMaintainer: 'Devon Vance',
    healthStatus: 'warning',
    layer: 'external',
    description: 'External credit card processing, 3D Secure verification, and payout webhooks.'
  },
  {
    id: 'notification-worker',
    name: 'NotificationWorker',
    type: 'service',
    language: 'TypeScript',
    framework: 'Node.js BullMQ',
    riskScore: 31,
    criticality: 'LOW',
    loc: 5200,
    churnRate: '+9% this month',
    dependenciesCount: 4,
    dependentsCount: 0,
    busFactor: 2,
    leadMaintainer: 'Aiden Brooks',
    healthStatus: 'healthy',
    layer: 'service',
    description: 'Email receipt generation, SMS one-time alerts, and customer webhook dispatches.'
  }
]

export const EDGES_DATA: ComponentEdge[] = [
  { source: 'api-gateway', target: 'auth-service', type: 'sync_http', latencyMs: 4, callVolume: '14.2k req/s', criticalPath: true },
  { source: 'api-gateway', target: 'order-service', type: 'grpc', latencyMs: 6, callVolume: '9.8k req/s', criticalPath: true },
  { source: 'api-gateway', target: 'payment-service', type: 'grpc', latencyMs: 12, callVolume: '3.4k req/s', criticalPath: true },
  { source: 'order-service', target: 'payment-service', type: 'grpc', latencyMs: 38, callVolume: '3.4k req/s', criticalPath: true },
  { source: 'order-service', target: 'inventory-service', type: 'grpc', latencyMs: 14, callVolume: '8.1k req/s', criticalPath: true },
  { source: 'order-service', target: 'postgres-db', type: 'sql_query', latencyMs: 18, callVolume: '18.5k q/s', criticalPath: true },
  { source: 'order-service', target: 'kafka-bus', type: 'async_queue', latencyMs: 3, callVolume: '4.2k evt/s', criticalPath: false },
  { source: 'payment-service', target: 'stripe-client', type: 'sync_http', latencyMs: 240, callVolume: '3.1k req/s', criticalPath: true },
  { source: 'payment-service', target: 'postgres-db', type: 'sql_query', latencyMs: 92, callVolume: '12.4k q/s', criticalPath: true },
  { source: 'payment-service', target: 'redis-cache', type: 'cache_lookup', latencyMs: 2, callVolume: '22.0k q/s', criticalPath: false },
  { source: 'payment-service', target: 'kafka-bus', type: 'async_queue', latencyMs: 4, callVolume: '3.1k evt/s', criticalPath: false },
  { source: 'inventory-service', target: 'postgres-db', type: 'sql_query', latencyMs: 11, callVolume: '7.8k q/s', criticalPath: false },
  { source: 'kafka-bus', target: 'notification-worker', type: 'async_queue', latencyMs: 5, callVolume: '3.1k evt/s', criticalPath: false }
]

export const RISKS_DATA: RiskItem[] = [
  {
    id: 'RSK-1049',
    componentId: 'payment-service',
    componentName: 'PaymentService',
    title: 'High Coupling & Connection Pool Exhaustion Risk',
    category: 'Architecture',
    severity: 'CRITICAL',
    score: 91,
    confidence: 94,
    detectedAt: '24 mins ago',
    summary: 'PaymentService directly ties 11 downstream modules into a synchronous database transaction loop without connection limits or backoff.',
    evidence: {
      observed: [
        '11 services/consumers directly invoke PaymentService synchronously',
        'Database connection pool cap reached 96% during peak traffic bursts',
        'Code churn in src/payment/settlement.ts exceeded +64% in last 14 days',
        'Absence of circuit breaker on the external Stripe HTTP client'
      ],
      deterministic: [
        'Cyclomatic complexity index: 38 (Threshold: 15)',
        'Afferent coupling (Ca): 14, Efferent coupling (Ce): 11, Instability (I): 0.44',
        'Fan-in concentration in the 99th percentile across entire repository'
      ],
      inference: [
        'Predicted failure pattern: Connection pool starvation under sudden 2x traffic surge',
        'Cascading failure probability: 89% across OrderService and InvoiceWorker'
      ]
    },
    potentialImpact: 'Total checkout stoppage, cascading 504 timeouts to APIGateway, dropped revenue events.',
    remediationSummary: 'Extract transaction settlement to async background queue, inject resilient circuit breaker, partition DB pool.',
    relatedFiles: ['src/services/payment/settlement.ts', 'src/config/database.ts', 'src/clients/stripe.ts'],
    relatedIncidents: ['INC-2024-892', 'INC-2024-781']
  },
  {
    id: 'RSK-1042',
    componentId: 'order-service',
    componentName: 'OrderService',
    title: 'N+1 Query Cascade in Order Price Calculation',
    category: 'Scalability',
    severity: 'HIGH',
    score: 78,
    confidence: 89,
    detectedAt: '2 hours ago',
    summary: 'Iterative discount voucher evaluation issues separate database queries for every line item without batch preloading.',
    evidence: {
      observed: [
        'Nested query loop detected in calculateCartDiscounts() inside src/order/discount.go',
        'Database query volume scales linearly O(N*M) with cart line items and coupons',
        'Average p99 query latency spiked from 18ms to 142ms on large orders'
      ],
      deterministic: [
        'Static AST analysis flagged unbatched DB invocation inside for-range construct (L142-L188)',
        'Redis caching bypass condition triggered whenever guest sessions are used'
      ],
      inference: [
        'High probability of severe database locking during flash sale campaigns'
      ]
    },
    potentialImpact: 'Database lock contention, high CPU on Postgres primary, 3-5x increased latency on checkout button click.',
    remediationSummary: 'Batch fetch discount rules using WHERE id IN (...) and cache active promotion matrix in Redis.',
    relatedFiles: ['src/order/discount.go', 'src/order/repository.go'],
    relatedIncidents: ['INC-2024-892']
  },
  {
    id: 'RSK-1033',
    componentId: 'auth-service',
    componentName: 'AuthService',
    title: 'Single Maintainer Bus Factor Vulnerability',
    category: 'Bus Factor',
    severity: 'HIGH',
    score: 65,
    confidence: 96,
    detectedAt: '1 day ago',
    summary: '94% of authentication, token signing, and encryption codebase authored exclusively by 1 developer.',
    evidence: {
      observed: [
        '94.2% of Git commits authored by Devon Vance over the last 180 days',
        'Zero cross-team code reviews on critical cryptography helper modules',
        'Absence of automated architectural documentation for key rotation routines'
      ],
      deterministic: [
        'Git blame analysis: 4,210 of 4,460 lines assigned to single committer identity',
        'Knowledge distribution entropy score: 0.14 (Critically low)'
      ],
      inference: [
        'High maintenance vulnerability if primary maintainer departs or is unavailable during security incident'
      ]
    },
    potentialImpact: 'Severe delay in patching zero-day vulnerabilities or managing cryptographic token rotation.',
    remediationSummary: 'Initiate paired architecture walkthroughs, mandate multi-maintainer approvals, document key rotation runbooks.',
    relatedFiles: ['src/auth/jwt_signer.go', 'src/auth/vault_keys.go'],
    relatedIncidents: []
  },
  {
    id: 'RSK-1021',
    componentId: 'stripe-client',
    componentName: 'StripePaymentAPI',
    title: 'Missing Resilient Fallback & Exponential Backoff',
    category: 'Reliability',
    severity: 'HIGH',
    score: 74,
    confidence: 91,
    detectedAt: '2 days ago',
    summary: 'Third-party API calls lack jittered retry backoff, risking thread blockage when Stripe experiences latency blips.',
    evidence: {
      observed: [
        'HTTP client configured with 30,000ms timeout and infinite blocking threads',
        'No circuit breaker pattern implemented (no fallback state when 5xx returned)',
        '34 thread stall events detected in last test run during simulated upstream latency'
      ],
      deterministic: [
        'Code inspection confirms raw fetch() call without Polly or Resilience4j circuit wrapper'
      ],
      inference: [
        'If Stripe latency increases above 2s, upstream Node event loop becomes saturated'
      ]
    },
    potentialImpact: 'Cascading worker exhaustion in PaymentService, taking down healthy internal payment routes.',
    remediationSummary: 'Wrap Stripe client with a 3-state circuit breaker (Closed/Open/Half-Open) and 3500ms strict timeout.',
    relatedFiles: ['src/clients/stripe.ts', 'src/services/payment/processor.ts'],
    relatedIncidents: ['INC-2024-892', 'INC-2024-781']
  }
]

export const ACTIVE_INCIDENT: IncidentRecord = {
  id: 'INC-2024-892',
  title: 'Elevated Payment Failures & 504 Gateway Timeouts',
  status: 'ACTIVE',
  severity: 'P0',
  startedAt: '14:31 UTC (44m ago)',
  duration: '44m ongoing',
  primaryComponent: 'PaymentService',
  rootCauseSummary: 'Deployment #892 introduced unindexed transaction lock queries and an un-throttled synchronous call loop in PaymentService, causing Postgres connection pool exhaustion and cascading 504 timeouts across checkout.',
  confidence: 92,
  timeline: [
    {
      time: '14:31:00 UTC',
      title: 'Deployment #892 Completed',
      type: 'deployment',
      description: 'Git commit e8a109f deployed to production cluster by CI/CD pipeline.',
      meta: 'Commit: perf(payment): rewrite transaction settlement loop'
    },
    {
      time: '14:34:12 UTC',
      title: 'Payment Latency Elevated (+42%)',
      type: 'metric_anomaly',
      description: 'Average latency on /api/v2/checkout/settle jumped from 180ms to 2,450ms.',
      meta: 'p99 latency: 6,800ms'
    },
    {
      time: '14:35:05 UTC',
      title: 'Postgres Connection Pool Saturation',
      type: 'alert',
      description: 'Active connections to PostgresPrimary reached 98/100 limit. Queued connection requests spiked.',
      meta: 'Pool exhaustion: 98% capacity'
    },
    {
      time: '14:36:20 UTC',
      title: 'Error Rate Spike on Order Checkout (31.4%)',
      type: 'log_error',
      description: 'Incoming customer orders failing with HTTP 504 Gateway Timeout and 500 ConnectionAcquireTimeoutException.',
      meta: '382 failed transactions / min'
    },
    {
      time: '14:37:45 UTC',
      title: 'RepoMind Correlated Incident & Root Cause Identified',
      type: 'alert',
      description: 'Cross-layer correlation flagged prior Risk RSK-1049 and mapped causal path from Deployment #892.',
      meta: 'Confidence: 92% Evidence-backed'
    }
  ],
  metrics: [
    { timestamp: '14:28', latencyMs: 180, errorRatePercent: 0.1, activeConnections: 24, cpuPercent: 22 },
    { timestamp: '14:30', latencyMs: 185, errorRatePercent: 0.2, activeConnections: 26, cpuPercent: 24 },
    { timestamp: '14:32', latencyMs: 420, errorRatePercent: 1.8, activeConnections: 45, cpuPercent: 39 },
    { timestamp: '14:34', latencyMs: 2450, errorRatePercent: 14.2, activeConnections: 88, cpuPercent: 78 },
    { timestamp: '14:36', latencyMs: 6200, errorRatePercent: 31.4, activeConnections: 98, cpuPercent: 91 },
    { timestamp: '14:38', latencyMs: 5800, errorRatePercent: 29.8, activeConnections: 96, cpuPercent: 88 },
    { timestamp: '14:40', latencyMs: 5950, errorRatePercent: 30.5, activeConnections: 98, cpuPercent: 89 }
  ],
  correlatedCommit: {
    hash: 'e8a109f',
    author: 'Devon Vance',
    message: 'perf(payment): rewrite transaction settlement loop',
    changedFiles: 4,
    prNumber: 412
  },
  traces: [
    { traceId: 'tr-9941a', span: 'APIGateway -> /api/v2/checkout', durationMs: 6840, status: 'error', errorDetail: '504 Gateway Timeout' },
    { traceId: 'tr-9941b', span: 'OrderService -> POST /internal/payment/settle', durationMs: 6810, status: 'error', errorDetail: 'ConnectionTimeout' },
    { traceId: 'tr-9941c', span: 'PaymentService -> PostgresPrimary (SELECT ... FOR UPDATE)', durationMs: 5000, status: 'error', errorDetail: 'LockAcquireTimeoutException' },
    { traceId: 'tr-9941d', span: 'PaymentService -> StripePaymentAPI (POST /v1/charges)', durationMs: 1240, status: 'ok' }
  ]
}

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-1',
    title: 'Payment Service Complete Outage',
    description: 'Simulates what happens if PaymentService pods crash or become unreachable.',
    trigger: 'PaymentService unavailable (100% packet drop)',
    affectedServices: ['OrderService', 'APIGateway', 'NotificationWorker', 'KafkaEventStream'],
    blastRadiusPercent: 68,
    riskLevel: 'CRITICAL',
    confidence: 96,
    propagationSteps: [
      { step: 1, component: 'PaymentService', symptom: 'Container crash loop / Port 50051 unreachable', delayMs: 0 },
      { step: 2, component: 'OrderService', symptom: 'gRPC connection timeout on checkout RPC (30s stall)', delayMs: 450 },
      { step: 3, component: 'APIGateway', symptom: 'Thread pool starvation from queued checkout HTTP requests', delayMs: 1200 },
      { step: 4, component: 'NotificationWorker', symptom: 'Zero receipt events queued in Kafka stream', delayMs: 2500 }
    ],
    recommendation: 'Implement asynchronous transaction queuing with localized order reservation status.'
  },
  {
    id: 'sim-2',
    title: 'PostgreSQL Database Latency 5× Surge',
    description: 'Simulates heavy lock contention causing query response times to jump from 15ms to 85ms.',
    trigger: 'PostgresPrimary latency multiplies by 500%',
    affectedServices: ['PaymentService', 'OrderService', 'InventoryService', 'APIGateway'],
    blastRadiusPercent: 54,
    riskLevel: 'HIGH',
    confidence: 91,
    propagationSteps: [
      { step: 1, component: 'PostgresPrimary', symptom: 'Query latency climbs from 15ms to 85ms (I/O saturation)', delayMs: 0 },
      { step: 2, component: 'PaymentService', symptom: 'Active DB connection pool exhausted within 12 seconds', delayMs: 600 },
      { step: 3, component: 'OrderService', symptom: 'Cart checkout latency exceeds client timeout threshold (3000ms)', delayMs: 1800 },
      { step: 4, component: 'APIGateway', symptom: '504 Gateway Timeout rate climbs to 24%', delayMs: 3200 }
    ],
    recommendation: 'Add read replicas for order history and cache hot price rules in Redis Cluster.'
  },
  {
    id: 'sim-3',
    title: 'Flash Sale Traffic Spike 10×',
    description: 'Simulates sudden surge from 1,200 req/s to 12,000 req/s within 60 seconds.',
    trigger: 'Incoming request volume surges 1000%',
    affectedServices: ['APIGateway', 'OrderService', 'PaymentService', 'PostgresPrimary', 'RedisCluster'],
    blastRadiusPercent: 82,
    riskLevel: 'CRITICAL',
    confidence: 88,
    propagationSteps: [
      { step: 1, component: 'APIGateway', symptom: 'Throughput reaches 12,400 req/s; CPU hits 88%', delayMs: 0 },
      { step: 2, component: 'RedisCluster', symptom: 'Eviction rate increases as cache keys churn rapidly', delayMs: 400 },
      { step: 3, component: 'OrderService', symptom: 'N+1 discount loop saturates CPU threads', delayMs: 1100 },
      { step: 4, component: 'PostgresPrimary', symptom: 'Connection backlog causes connection dropped errors', delayMs: 2100 }
    ],
    recommendation: 'Deploy auto-scaling policy on OrderService and enable edge rate limiting on APIGateway.'
  },
  {
    id: 'sim-4',
    title: 'External Stripe Payment Gateway Outage',
    description: 'Simulates third-party provider latency degradation and 503 Service Unavailable responses.',
    trigger: 'StripePaymentAPI returns 503 HTTP errors',
    affectedServices: ['PaymentService', 'OrderService'],
    blastRadiusPercent: 38,
    riskLevel: 'HIGH',
    confidence: 94,
    propagationSteps: [
      { step: 1, component: 'StripePaymentAPI', symptom: 'Upstream gateway starts responding with 503 / 10s latency', delayMs: 0 },
      { step: 2, component: 'PaymentService', symptom: 'Synchronous threads block waiting for HTTP response', delayMs: 500 },
      { step: 3, component: 'OrderService', symptom: 'User checkout button remains spinning indefinitely', delayMs: 1500 }
    ],
    recommendation: 'Configure circuit breaker to fail-fast with user-friendly retry message after 3500ms.'
  }
]

export const REMEDIATION_PLANS: RemediationPlan[] = [
  {
    id: 'REM-892',
    riskId: 'RSK-1049',
    componentId: 'payment-service',
    componentName: 'PaymentService',
    priority: 'CRITICAL',
    title: 'Remediate Connection Pool Exhaustion & Decouple Settlement Loop',
    problemDescription: 'PaymentService holds an open SQL transaction for the full duration of external Stripe API calls and nested coupon updates. Under concurrent traffic, 98 of 100 DB connections stay locked, causing system-wide timeouts.',
    rootCauseAnalysis: 'Observed in commit e8a109f: The transaction scope was extended across the external network call without timeout or retry jitter, causing thread starvation.',
    effort: 'Low',
    impact: 'Critical',
    steps: [
      '1. Shorten database transaction boundary: commit local order state before invoking Stripe API.',
      '2. Implement dedicated connection pool slice (max 20 connections) for settlement tasks.',
      '3. Wrap external payment processor in resilient circuit breaker with 3500ms timeout.',
      '4. Add integration test asserting connection release on Stripe latency spikes.'
    ],
    codePatch: {
      file: 'src/services/payment/settlement.ts',
      language: 'typescript',
      beforeCode: `// BEFORE: Holding DB transaction open during external HTTP call
export async function executeSettlement(orderId: string, amount: number) {
  const tx = await db.beginTransaction();
  try {
    const order = await tx.orders.lockForUpdate(orderId);
    
    // CRITICAL BUG: External HTTP call inside open DB transaction!
    const stripeResult = await stripeClient.charges.create({
      amount: amount * 100,
      currency: 'usd',
      orderId: orderId,
    });
    
    await tx.orders.updateStatus(orderId, 'SETTLED');
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}`,
      afterCode: `// AFTER: Decoupled transaction scope with Circuit Breaker
export async function executeSettlement(orderId: string, amount: number) {
  // 1. Stage order status before external call (fast 2ms query)
  await db.orders.updateStatus(orderId, 'PAYMENT_PENDING');

  // 2. Invoke Stripe with circuit breaker & strict 3500ms timeout
  const stripeResult = await paymentCircuitBreaker.execute(async () => {
    return await stripeClient.charges.create({
      amount: amount * 100,
      currency: 'usd',
      orderId: orderId,
    }, { timeout: 3500 });
  });

  // 3. Finalize order in isolated quick transaction
  const tx = await db.beginTransaction();
  try {
    await tx.orders.markSettled(orderId, stripeResult.id);
    await tx.commit();
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}`,
      explanation: 'Moves the 1200ms+ external network call outside the SQL transaction boundary. Database connection duration plummets from ~1400ms to <6ms per transaction!'
    },
    validationMetrics: [
      { metric: 'PaymentService Risk Score', before: 91, after: 67, improvement: '-24 pts (High -> Medium)' },
      { metric: 'DB Connection Hold Duration', before: '1,420 ms', after: '5.8 ms', improvement: '99.6% reduction' },
      { metric: 'System Overall Health Score', before: '72 / 100', after: '88 / 100', improvement: '+16 pts' },
      { metric: 'P99 Checkout Latency', before: '6,800 ms', after: '240 ms', improvement: '96.4% faster' },
      { metric: 'Test Suite Coverage on Payment', before: '42%', after: '76%', improvement: '+34% coverage' }
    ],
    preventiveMeasures: [
      'Enable static AST linter rule: disallow async network calls inside beginTransaction() blocks.',
      'Configure Prometheus alert rule: alert when DB connection pool usage exceeds 75% for >60s.',
      'Establish automated rollback canary on error rate > 2% post-deployment.'
    ]
  },
  {
    id: 'REM-1042',
    riskId: 'RSK-1042',
    componentId: 'order-service',
    componentName: 'OrderService',
    priority: 'HIGH',
    title: 'Batch Load Discount Vouchers & Cache Promotion Matrices',
    problemDescription: 'Iterative database queries in calculateCartDiscounts() generate 15-20 individual queries per checkout page load.',
    rootCauseAnalysis: 'Loop-based querying inside order/discount.go creates severe database lock contention during concurrent traffic.',
    effort: 'Low',
    impact: 'High',
    steps: [
      '1. Replace iterative SQL queries with single batched WHERE voucher_code IN (...) query.',
      '2. Cache valid promotion rules in Redis with a 5-minute sliding TTL.',
      '3. Add unit test measuring database query count per cart evaluation.'
    ],
    codePatch: {
      file: 'src/order/discount.go',
      language: 'go',
      beforeCode: `// BEFORE: N+1 query loop
func CalculateDiscounts(cart *Cart) ([]Discount, error) {
    var discounts []Discount
    for _, code := range cart.CouponCodes {
        // High risk: single DB hit per coupon in loop
        coupon, err := db.FindCouponByCode(code)
        if err != nil { continue }
        discounts = append(discounts, coupon.Apply(cart))
    }
    return discounts, nil
}`,
      afterCode: `// AFTER: Batched query with Redis cache pre-flight
func CalculateDiscounts(cart *Cart) ([]Discount, error) {
    if len(cart.CouponCodes) == 0 {
        return nil, nil
    }
    // Single batch query or cached slice lookup
    coupons, err := cache.BatchGetOrFetchCoupons(cart.CouponCodes, func(missing []string) ([]Coupon, error) {
        return db.FindCouponsInCodes(missing)
    })
    if err != nil { return nil, err }
    return ApplyCoupons(cart, coupons), nil
}`,
      explanation: 'Reduces query volume by up to 92% per checkout request by pre-fetching all matching coupons in one round-trip.'
    },
    validationMetrics: [
      { metric: 'OrderService Risk Score', before: 78, after: 52, improvement: '-26 pts' },
      { metric: 'SQL Queries per Checkout', before: '18 queries', after: '2 queries', improvement: '89% fewer queries' },
      { metric: 'Database CPU Utilization', before: '78%', after: '28%', improvement: '50% reduction' }
    ],
    preventiveMeasures: [
      'Add CI AST check for un-batched database calls in Go repository functions.'
    ]
  }
]

export const ENGINEERING_FINGERPRINT = {
  overallDisciplineScore: 81,
  dimensions: [
    { label: 'Code Quality', score: 84, benchmark: 75, status: 'Strong', description: 'Clean architecture with consistent repository abstractions.' },
    { label: 'Testing Discipline', score: 62, benchmark: 70, status: 'Needs Improvement', description: 'Core payment paths lack unit test coverage on error branches.' },
    { label: 'Refactoring Cadence', score: 79, benchmark: 65, status: 'Strong', description: 'Active technical debt cleanup routines in sprint cycles.' },
    { label: 'Documentation', score: 58, benchmark: 70, status: 'Warning', description: 'Internal gRPC protobuf contracts lack updated schema docs.' },
    { label: 'Code Churn Stability', score: 69, benchmark: 75, status: 'Moderate', description: 'High volatility in payment module commits over recent 30 days.' },
    { label: 'Bus Factor Health', score: 52, benchmark: 70, status: 'Critical', description: 'Critical crypto & payment components concentrated in 1 author.' }
  ]
}

export const AI_ASSISTANT_SUGGESTIONS = [
  'Why is PaymentService considered our highest risk component?',
  'What was the primary root cause behind Incident #INC-2024-892?',
  'What components break if the PostgresPrimary database fails?',
  'How much will our system risk drop if we apply Remediation REM-892?',
  'Explain the engineering bus factor vulnerability in AuthService.',
  'What are the 3 actions I should take today before the next deploy?'
]
