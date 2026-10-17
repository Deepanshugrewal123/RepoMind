import React from 'react'
import { COMPONENTS_DATA } from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import { ContextualHelp } from '../../common/ContextualHelp'
import {
  Flame,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react'

export const BlastRadiusView: React.FC = () => {
  const { selectedComponentId, setSelectedComponentId, navigateToAppTab } = useApp()

  const selectedComponent =
    COMPONENTS_DATA.find((c) => c.id === selectedComponentId) || COMPONENTS_DATA[1]

  const isPayment = selectedComponent.id === 'payment-service'
  const isOrder = selectedComponent.id === 'order-service'

  // Dynamic tiers depending on selected component
  const blastData = isPayment
    ? {
        radiusPercent: 68,
        risk: 'CRITICAL',
        affectedApis: ['/api/v2/checkout/settle', '/api/v1/orders/create', '/webhooks/stripe'],
        rto: '4.5 mins',
        tier1: ['OrderService (gRPC sync timeout)', 'APIGateway (504 Gateway Timeout)'],
        tier2: ['CheckoutFrontend (Spinner freeze)', 'InvoiceWorker (Backlogged queue)'],
        tier3: ['NotificationWorker (Delayed receipt emails)', 'KafkaEventStream (Buffer buildup)']
      }
    : isOrder
    ? {
        radiusPercent: 54,
        risk: 'HIGH',
        affectedApis: ['/api/v1/cart/checkout', '/api/v1/discounts/validate'],
        rto: '2.5 mins',
        tier1: ['APIGateway (502 Bad Gateway)', 'PaymentService (Idle thread waiting)'],
        tier2: ['InventoryService (Unreleased hold leases)', 'PostgresPrimary (Lock contention)'],
        tier3: ['AnalyticsPipeline (Missing conversion events)']
      }
    : {
        radiusPercent: 32,
        risk: 'MEDIUM',
        affectedApis: ['/internal/rpc'],
        rto: '1.2 mins',
        tier1: ['APIGateway (Partial degradation)'],
        tier2: ['Downstream microservices (Cached fallbacks active)'],
        tier3: ['Background worker queues']
      }

  return (
    <div className="space-y-6 pb-20">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--accent-orange)' }}>
              [RADIUS // 04.FAILURE_PROPAGATION]
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Concentric Blast Radius Mapping
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Simulate failure propagation across direct and transitive dependencies.
          </p>
        </div>

        {/* Component Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span style={{ color: 'var(--muted-foreground)' }}>Epicenter:</span>
          <select
            value={selectedComponent.id}
            onChange={(e) => setSelectedComponentId(e.target.value)}
            className="px-3 py-1.5 rounded-xl outline-none font-bold transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--surface-interactive)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)'
            }}
          >
            {COMPONENTS_DATA.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (Risk {c.riskScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Concentric Ripple Waves (7 cols) */}
        <div
          className="lg:col-span-7 rounded-3xl p-6 space-y-6 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="flex items-center justify-between pb-3 font-mono text-xs"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>Concentric Impact Horizons</span>
              <ContextualHelp term="blast-radius" />
            </div>
            <span className="font-bold" style={{ color: 'var(--accent-orange)' }}>
              EST. BLAST RADIUS: {blastData.radiusPercent}%
            </span>
          </div>

          {/* Visual Nested Ripple Rings */}
          <div className="relative py-8 flex flex-col items-center justify-center">
            {/* Outer Ring: Tier 3 */}
            <div
              className="w-[96%] max-w-[420px] rounded-3xl p-5 text-center space-y-3"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.25)'
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--accent-orange)' }}>
                Tier 3 • Peripheral & Async Impact
              </span>

              {/* Middle Ring: Tier 2 */}
              <div
                className="w-[92%] mx-auto rounded-2xl p-5 text-center space-y-3"
                style={{
                  backgroundColor: 'rgba(234, 88, 12, 0.08)',
                  border: '1px solid rgba(234, 88, 12, 0.35)'
                }}
              >
                <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider block">
                  Tier 2 • Transitive Callers & Workers
                </span>

                {/* Inner Ring: Tier 1 */}
                <div
                  className="w-[88%] mx-auto rounded-xl p-4 text-center space-y-2"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider block">
                    Tier 1 • Direct Synchronous Callers
                  </span>

                  {/* Epicenter Core */}
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div className="font-bold text-sm font-mono flex items-center justify-center gap-1.5" style={{ color: 'var(--foreground)' }}>
                      <Flame className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
                      <span>{selectedComponent.name}</span>
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                      Failure Epicenter
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Breakdown Descriptions */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 space-y-1">
              <div className="font-bold text-[11px]">TIER 1 (Immediate Outage):</div>
              {blastData.tier1.map((item, idx) => (
                <div key={idx} className="text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>• {item}</div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 space-y-1">
              <div className="font-bold text-[11px]">TIER 2 (Cascading Degradation):</div>
              {blastData.tier2.map((item, idx) => (
                <div key={idx} className="text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>• {item}</div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 space-y-1">
              <div className="font-bold text-[11px]">TIER 3 (Delayed Buffer Exhaustion):</div>
              {blastData.tier3.map((item, idx) => (
                <div key={idx} className="text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>• {item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quantitative Blast Impact Metrics (5 cols) */}
        <div
          className="lg:col-span-5 rounded-3xl p-6 space-y-5 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="pb-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--muted-foreground)' }}>Quantitative Assessment</span>
            <h3 className="text-xl font-bold font-display mt-0.5" style={{ color: 'var(--foreground)' }}>
              Failure Impact Summary
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div
              className="p-3.5 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Total System Blast Radius</span>
              <span className="font-bold text-sm" style={{ color: 'var(--accent-orange)' }}>{blastData.radiusPercent}%</span>
            </div>

            <div
              className="p-3.5 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Risk Classification</span>
              <span className="text-rose-400 font-bold">{blastData.risk}</span>
            </div>

            <div
              className="p-3.5 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Recovery Time Objective (RTO)</span>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>{blastData.rto}</span>
            </div>

            <div
              className="p-3.5 rounded-xl space-y-2"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span className="block" style={{ color: 'var(--muted-foreground)' }}>Critical Request Endpoints Affected:</span>
              {blastData.affectedApis.map((api, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded text-[11px]"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground-secondary)'
                  }}
                >
                  {api}
                </div>
              ))}
            </div>
          </div>

          <div
            className="pt-3 space-y-2"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <LiquidMagneticButton
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigateToAppTab('simulation')}
              icon={<Cpu className="w-3.5 h-3.5" />}
            >
              Run Simulation in Sandbox
            </LiquidMagneticButton>

            <LiquidMagneticButton
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigateToAppTab('remediation', selectedComponent.id)}
            >
              View Isolation Remediation Plan
            </LiquidMagneticButton>
          </div>
        </div>
      </div>
    </div>
  )
}
