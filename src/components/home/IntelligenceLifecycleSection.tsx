import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  Layers,
  ShieldAlert,
  Activity,
  Wrench,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react'

export const IntelligenceLifecycleSection: React.FC = () => {
  const { navigateToAppTab } = useApp()
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 'understand',
      number: '01',
      title: 'UNDERSTAND',
      tab: 'architecture' as const,
      plain: 'See how your software is actually connected.',
      tech: 'AST extraction, static call-graph synthesis, dependency concentration, and engineering patterns.',
      icon: <Layers className="w-5 h-5 text-sky-500" />,
      preview: '10 Microservices • 13 Direct & Transitive Connections • 4 Frameworks Parsed'
    },
    {
      id: 'predict',
      number: '02',
      title: 'PREDICT',
      tab: 'risks' as const,
      plain: 'Discover which changes could cause the biggest problems.',
      tech: 'Multi-factor risk scoring across coupling, code churn volatility, test coverage, and single-author bus factors.',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      preview: 'System Health 72/100 • 3 Critical Risks Flagged • 89% Cascade Probability'
    },
    {
      id: 'investigate',
      number: '03',
      title: 'INVESTIGATE',
      tab: 'incidents' as const,
      plain: 'When an outage happens, trace what broke in seconds.',
      tech: 'Correlate Git commits, CI/CD deployments, Prometheus error metrics, and distributed OpenTelemetry spans.',
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      preview: 'Deployment #892 ➔ 14:34 Latency Spike ➔ 14:35 DB Pool Saturation (98%)'
    },
    {
      id: 'resolve',
      number: '04',
      title: 'RESOLVE',
      tab: 'remediation' as const,
      plain: 'Get prioritized remediation plans with real code diffs.',
      tech: 'AST-safe patch synthesis, transaction decoupling, circuit breaker injection, and automated unit test generation.',
      icon: <Wrench className="w-5 h-5 text-teal-500" />,
      preview: 'Plan REM-892: Decouple External HTTP Call from SQL Lock (99.6% Hold Reduction)'
    },
    {
      id: 'validate',
      number: '05',
      title: 'VALIDATE',
      tab: 'validation' as const,
      plain: 'Verify whether the fix actually improved system health.',
      tech: 'Immediate post-fix differential scoring: Before vs After risk, coupling degree, and latency regression checks.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      preview: 'Risk: 91 ➔ 67 ↓ • P99 Latency: 6800ms ➔ 240ms ↓ • Health Recovery: +16 pts'
    },
    {
      id: 'learn',
      number: '06',
      title: 'LEARN',
      tab: 'analytics' as const,
      plain: 'Continuously prevent similar failures from repeating.',
      tech: 'Bayesian outcome calibration, automated CI guardrail synthesis, and engineering behavior fingerprinting.',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      preview: '14 Custom CI Linter Rules Generated • Zero Incident Recurrence in 60 Days'
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 mb-2 block font-semibold">
          THE CONTINUOUS INTELLIGENCE CYCLE
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display" style={{ color: 'var(--foreground)' }}>
          Six Stages. One Unified Flow.
        </h2>
        <p className="text-sm sm:text-base mt-3 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
          Software intelligence is not a one-off scan. It is a continuous loop connecting code creation, deployment telemetry, and incident resolution.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx
          return (
            <div
              key={step.id}
              style={{
                backgroundColor: isSelected ? 'var(--surface-elevated)' : 'transparent',
                borderColor: isSelected ? 'var(--accent-orange)' : 'var(--border)'
              }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isSelected ? 'shadow-md ring-1 ring-amber-500/30' : 'opacity-85 hover:opacity-100'
              }`}
            >
              <button
                onClick={() => setActiveStep(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-amber-500 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: 'var(--foreground-secondary)' }}>
                      "{step.plain}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                    className="hidden sm:block p-2 rounded-xl border"
                  >
                    {step.icon}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isSelected ? 'rotate-180 text-amber-500' : ''
                    }`}
                    style={{ color: isSelected ? undefined : 'var(--muted-foreground)' }}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              {isSelected && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t space-y-4 animate-in fade-in duration-200" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                      className="p-3.5 rounded-xl border"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider mb-1 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                        Technical Ingestion & Algorithms
                      </div>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                        {step.tech}
                      </p>
                    </div>

                    <div 
                      style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border-subtle)' }}
                      className="p-3.5 rounded-xl border"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 mb-1 font-semibold">
                        Live System Signal
                      </div>
                      <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--foreground)' }}>
                        {step.preview}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <LiquidMagneticButton
                      variant="primary"
                      size="sm"
                      onClick={() => navigateToAppTab(step.tab)}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Inspect {step.title} in Workspace
                    </LiquidMagneticButton>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
