import React, { useState } from 'react'
import { COMPONENTS_DATA, ComponentNode } from '../../../data/mockData'
import { useApp } from '../../../context/AppContext'
import { LiquidMagneticButton } from '../../ui/LiquidMagneticButton'
import { ContextualHelp } from '../../common/ContextualHelp'
import {
  Layers,
  Server,
  Database,
  Cloud,
  Cpu,
  User,
  GitCommit,
  Flame,
  ShieldAlert,
  ArrowRight,
  Code2
} from 'lucide-react'

export const ArchitectureView: React.FC = () => {
  const { selectedComponentId, setSelectedComponentId, navigateToAppTab, openExplainDrawer, componentsData } = useApp()

  const activeComponents = componentsData && componentsData.length > 0 ? componentsData : COMPONENTS_DATA

  const selectedComponent =
    activeComponents.find((c) => c.id === selectedComponentId) || activeComponents[0]

  const layers: { title: string; type: ComponentNode['layer']; desc: string }[] = [
    { title: 'Edge & Ingress Gateway', type: 'gateway', desc: 'Reverse proxy, SSL termination, and routing entrypoints' },
    { title: 'Core Modules & Services', type: 'service', desc: 'Business logic, transaction orchestration, domain models' },
    { title: 'Data Stores & Message Queues', type: 'data', desc: 'Relational storage, distributed caching, async buses' },
    { title: 'Third-Party & External Dependencies', type: 'external', desc: 'External SaaS vendors, network clients, SDKs' }
  ]

  // Any components with custom or undefined layer get grouped under core
  const getCompsForLayer = (type: ComponentNode['layer']) => {
    if (type === 'service') {
      return activeComponents.filter((c) => c.layer === 'service' || !['gateway', 'data', 'external'].includes(c.layer))
    }
    return activeComponents.filter((c) => c.layer === type)
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
              [LAYER // 01.TOPOLOGY]
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Architecture Topology & Service Boundaries
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Synthesized from lexical import hierarchies, manifest declarations, and component boundaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LiquidMagneticButton
            variant="glass"
            size="sm"
            onClick={() => navigateToAppTab('graph', selectedComponent.id)}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open in Knowledge Graph
          </LiquidMagneticButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Layered Architecture Components (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {layers.map((layer) => {
            const comps = getCompsForLayer(layer.type)
            if (comps.length === 0) return null

            return (
              <div
                key={layer.type}
                className="rounded-3xl p-5 space-y-3 transition-colors"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <div
                  className="flex items-center justify-between pb-2 font-mono text-xs"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-orange)' }} />
                    <span className="font-bold" style={{ color: 'var(--foreground)' }}>{layer.title}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{layer.desc}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {comps.map((comp) => {
                    const isSelected = comp.id === selectedComponent.id
                    return (
                      <div
                        key={comp.id}
                        onClick={() => setSelectedComponentId(comp.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected ? 'shadow-lg scale-[1.02]' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--surface-interactive)',
                          borderColor: isSelected ? 'var(--accent-orange)' : 'var(--border)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{comp.name}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              comp.riskScore >= 80
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                : comp.riskScore >= 60
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            Risk: {comp.riskScore}
                          </span>
                        </div>

                        <div className="text-xs font-mono space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="flex justify-between">
                            <span>Stack:</span>
                            <span style={{ color: 'var(--foreground-secondary)' }}>{comp.framework}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1">
                              Direct Deps:
                              <ContextualHelp term="coupling" />
                            </span>
                            <span style={{ color: 'var(--foreground-secondary)' }}>{comp.dependenciesCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Downstream Callers:</span>
                            <span style={{ color: 'var(--foreground-secondary)' }}>{comp.dependentsCount}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: Selected Component Deep Inspector (4 cols) */}
        <div
          className="lg:col-span-4 rounded-3xl p-6 space-y-5 h-fit sticky top-24 transition-colors"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <div
            className="flex items-center justify-between pb-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider block" style={{ color: 'var(--muted-foreground)' }}>
                Component Inspector
              </span>
              <h3 className="text-xl font-bold font-display mt-0.5" style={{ color: 'var(--foreground)' }}>
                {selectedComponent.name}
              </h3>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                selectedComponent.riskScore >= 80
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : selectedComponent.riskScore >= 60
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              Risk: {selectedComponent.riskScore}/100
            </span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            {selectedComponent.description}
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div
              className="p-3 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Language & Framework</span>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedComponent.framework}</span>
            </div>

            <div
              className="p-3 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Lines of Code (LOC)</span>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedComponent.loc.toLocaleString()} LOC</span>
            </div>

            <div
              className="p-3 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Code Churn Rate</span>
              <span className="font-bold" style={{ color: 'var(--accent-orange)' }}>{selectedComponent.churnRate}</span>
            </div>

            <div
              className="p-3 rounded-xl flex justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span style={{ color: 'var(--muted-foreground)' }}>Lead Maintainer</span>
              <span style={{ color: 'var(--foreground-secondary)' }}>{selectedComponent.leadMaintainer}</span>
            </div>

            <div
              className="p-3 rounded-xl flex items-center justify-between"
              style={{
                backgroundColor: 'var(--surface-interactive)',
                border: '1px solid var(--border)'
              }}
            >
              <span className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                Maintainer Bus Factor
                <ContextualHelp term="bus-factor" />
              </span>
              <span
                className={`font-bold ${
                  selectedComponent.busFactor === 1 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {selectedComponent.busFactor === 1 ? '1 (Critical Single Author)' : selectedComponent.busFactor}
              </span>
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
              onClick={() => navigateToAppTab('blast-radius', selectedComponent.id)}
              icon={<Flame className="w-3.5 h-3.5" />}
            >
              Simulate Blast Radius
            </LiquidMagneticButton>

            <button
              onClick={() => openExplainDrawer(undefined, selectedComponent.id)}
              className="w-full text-center text-xs font-mono py-1.5 cursor-pointer font-medium transition-opacity hover:opacity-80"
              style={{ color: 'var(--accent-orange)' }}
            >
              Why is {selectedComponent.name} rated {selectedComponent.riskScore}? (Evidence) →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
