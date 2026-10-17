import React, { useState } from 'react'
import { SIMULATION_SCENARIOS, SimulationScenario } from '../../data/mockData'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { ContextualHelp } from '../common/ContextualHelp'
import {
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Radio,
  Layers,
  Sparkles
} from 'lucide-react'

export const InteractiveSimulationDemo: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SIMULATION_SCENARIOS[0].id)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [simulationComplete, setSimulationComplete] = useState<boolean>(true)
  const [activeStep, setActiveStep] = useState<number>(4)

  const activeScenario = SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATION_SCENARIOS[0]

  const runSimulation = () => {
    setIsSimulating(true)
    setSimulationComplete(false)
    setActiveStep(1)

    setTimeout(() => setActiveStep(2), 500)
    setTimeout(() => setActiveStep(3), 1100)
    setTimeout(() => setActiveStep(4), 1800)
    setTimeout(() => {
      setIsSimulating(false)
      setSimulationComplete(true)
    }, 2200)
  }

  return (
    <div 
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--card-shadow)'
      }}
      className="w-full rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-3" style={{ borderColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1 font-semibold">
            <Cpu className="w-4 h-4" />
            <span>Interactive "What If?" Failure Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" style={{ color: 'var(--muted-foreground)' }}>
              SIMULATED ENVIRONMENT
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Simulate Failures Before They Reach Users.
          </h3>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--foreground-secondary)' }}>
            Select a hypothetical system shock to watch how risk propagates across service boundaries in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LiquidMagneticButton
            variant="primary"
            size="sm"
            onClick={runSimulation}
            isLoading={isSimulating}
            loadingText="Simulating..."
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Run Simulation
          </LiquidMagneticButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Scenario Selection Cards */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Select Hypothetical Scenario
          </div>
          {SIMULATION_SCENARIOS.map((scen) => {
            const isSelected = scen.id === selectedScenarioId
            return (
              <button
                key={scen.id}
                onClick={() => {
                  setSelectedScenarioId(scen.id)
                  runSimulation()
                }}
                style={{
                  backgroundColor: isSelected ? 'var(--surface-interactive)' : 'transparent',
                  borderColor: isSelected ? 'var(--accent-orange)' : 'var(--border-subtle)'
                }}
                className={`
                  w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer block
                  ${isSelected ? 'shadow-md ring-1 ring-amber-500/30' : 'opacity-80 hover:opacity-100'}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: isSelected ? 'var(--accent-orange)' : 'var(--foreground)' }}>
                    {scen.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      scen.riskLevel === 'CRITICAL' ? 'bg-red-500/15 text-red-500 border border-red-500/20' : 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {scen.riskLevel}
                  </span>
                </div>
                <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                  {scen.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Dynamic Propagation Visualization */}
        <div 
          style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
          className="lg:col-span-8 flex flex-col justify-between rounded-2xl border p-5"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b gap-2 font-mono text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span style={{ color: 'var(--muted-foreground)' }}>Trigger:</span>
                <span className="font-bold" style={{ color: 'var(--foreground)' }}>{activeScenario.trigger}</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-rose-500 flex items-center gap-1 font-medium">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Blast Radius: <strong>{activeScenario.blastRadiusPercent}%</strong></span>
                  <ContextualHelp term="Blast Radius" />
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Confidence: {activeScenario.confidence}%</span>
              </div>
            </div>

            {/* Propagation Step-by-Step Chain */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Simulated Propagation Timeline
              </div>
              {activeScenario.propagationSteps.map((step) => {
                const isReached = activeStep >= step.step
                return (
                  <div
                    key={step.step}
                    style={{
                      backgroundColor: isReached ? 'var(--surface-elevated)' : 'transparent',
                      borderColor: isReached ? 'var(--accent-orange)' : 'var(--border-subtle)',
                      opacity: isReached ? 1 : 0.4
                    }}
                    className="p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 shadow-xs"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isReached ? 'bg-amber-500 text-black shadow-sm' : 'bg-black/10 dark:bg-white/10 text-slate-400'
                      }`}
                    >
                      {step.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs" style={{ color: 'var(--foreground)' }}>{step.component}</span>
                        <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>+{step.delayMs}ms</span>
                      </div>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>{step.symptom}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Protective Action Recommendation */}
          <div className="mt-5 pt-3.5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Preventative Safeguard: </span>
                <span style={{ color: 'var(--foreground-secondary)' }}>{activeScenario.recommendation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
