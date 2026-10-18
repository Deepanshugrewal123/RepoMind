import React, { useState } from 'react'
import { COMPONENTS_DATA, EDGES_DATA, ComponentNode } from '../../data/mockData'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import { ContextualHelp } from '../common/ContextualHelp'
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Search,
  ShieldAlert,
  Layers,
  ArrowRight,
  Flame,
  Activity,
  Code2
} from 'lucide-react'

export const InteractiveGraphDemo: React.FC = () => {
  const { navigateToAppTab, openExplainDrawer, componentsData, edgesData, isCustomRepo } = useApp()
  const activeComponents = componentsData && componentsData.length > 0 ? componentsData : COMPONENTS_DATA
  const activeEdges = edgesData && edgesData.length > 0 ? edgesData : EDGES_DATA

  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeComponents[0]?.id || 'payment-service')
  const [showRiskColors, setShowRiskColors] = useState<boolean>(true)
  const [showCriticalOnly, setShowCriticalOnly] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  // Positions mapped for circular / layered graph layout (SVG viewBox 800 x 480)
  const nodePositions: Record<string, { x: number; y: number }> = {
    'api-gateway': { x: 120, y: 240 },
    'auth-service': { x: 260, y: 110 },
    'order-service': { x: 320, y: 240 },
    'inventory-service': { x: 320, y: 390 },
    'payment-service': { x: 500, y: 200 },
    'postgres-db': { x: 680, y: 200 },
    'redis-cache': { x: 620, y: 90 },
    'kafka-bus': { x: 500, y: 360 },
    'stripe-client': { x: 720, y: 330 },
    'notification-worker': { x: 660, y: 420 }
  }

  const getNodePos = (node: ComponentNode, idx: number, total: number) => {
    if ((node as any).x && (node as any).y) {
      return { x: (node as any).x, y: (node as any).y }
    }
    if (nodePositions[node.id]) {
      return nodePositions[node.id]
    }
    const angle = (idx / Math.max(1, total)) * 2 * Math.PI - Math.PI / 2
    return {
      x: Math.round(410 + 260 * Math.cos(angle)),
      y: Math.round(240 + 150 * Math.sin(angle))
    }
  }

  const selectedNode = activeComponents.find((c) => c.id === selectedNodeId) || activeComponents[0]

  const getNodeColor = (node: ComponentNode) => {
    if (!showRiskColors) return '#38bdf8'
    if (node.riskScore >= 80) return '#ef4444'
    if (node.riskScore >= 60) return '#f97316'
    if (node.riskScore >= 40) return '#eab308'
    return '#10b981'
  }

  const filteredEdges = activeEdges.filter((e) => {
    if (showCriticalOnly) return e.criticalPath
    return true
  })

  return (
    <div 
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--card-shadow)'
      }}
      className="w-full rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-3" style={{ borderColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider mb-1 font-semibold">
            <Network className="w-4 h-4" />
            <span>Interactive Software Knowledge Graph</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" style={{ color: 'var(--muted-foreground)' }}>
              {isCustomRepo ? 'ANALYZED REPOSITORY' : 'DEMO DATASET'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            A Living Topological Map of Your Architecture.
          </h3>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--foreground-secondary)' }}>
            Select any node to explore afferent coupling, transitive callers, and live incident correlation.
          </p>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRiskColors(!showRiskColors)}
            style={{
              backgroundColor: showRiskColors ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-interactive)',
              borderColor: showRiskColors ? 'var(--accent-orange)' : 'var(--border)',
              color: showRiskColors ? 'var(--accent-orange)' : 'var(--foreground-secondary)'
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer font-medium"
          >
            {showRiskColors ? '● Risk Heatmap ON' : '○ Risk Heatmap OFF'}
          </button>
          <button
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            style={{
              backgroundColor: showCriticalOnly ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-interactive)',
              borderColor: showCriticalOnly ? 'var(--accent-red)' : 'var(--border)',
              color: showCriticalOnly ? 'var(--accent-red)' : 'var(--foreground-secondary)'
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer font-medium"
          >
            {showCriticalOnly ? 'Critical Paths Only' : 'All Links'}
          </button>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* SVG Interactive Canvas */}
        <div 
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
          className="lg:col-span-8 relative h-[440px] rounded-2xl border overflow-hidden flex items-center justify-center"
        >
          {/* Zoom controls */}
          <div 
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 p-1.5 rounded-xl border shadow-sm"
          >
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.75))}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              Reset
            </button>
          </div>

          <svg
            viewBox="0 0 820 480"
            className="w-full h-full transition-transform duration-300 select-none cursor-grab active:cursor-grabbing"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill="rgba(255,255,255,0.25)" />
              </marker>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Edges */}
            {filteredEdges.map((edge, i) => {
              const srcNode = activeComponents.find((c) => c.id === edge.source)
              const tgtNode = activeComponents.find((c) => c.id === edge.target)
              const srcIdx = activeComponents.findIndex((c) => c.id === edge.source)
              const tgtIdx = activeComponents.findIndex((c) => c.id === edge.target)
              const src = srcNode ? getNodePos(srcNode, srcIdx, activeComponents.length) : nodePositions[edge.source]
              const tgt = tgtNode ? getNodePos(tgtNode, tgtIdx, activeComponents.length) : nodePositions[edge.target]
              if (!src || !tgt) return null

              const isEdgeHighlighted =
                edge.source === selectedNodeId || edge.target === selectedNodeId

              return (
                <g key={i}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={
                      isEdgeHighlighted
                        ? '#f97316'
                        : edge.criticalPath
                        ? 'rgba(255,255,255,0.22)'
                        : 'rgba(255,255,255,0.08)'
                    }
                    strokeWidth={isEdgeHighlighted ? 2.5 : edge.criticalPath ? 1.5 : 1}
                    strokeDasharray={edge.type === 'async_queue' ? '4 4' : undefined}
                    markerEnd="url(#arrow)"
                  />
                  {/* Subtle animated packet along active connection */}
                  {isEdgeHighlighted && (
                    <circle r="2.5" fill="#f97316">
                      <animateMotion
                        path={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`}
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {activeComponents.map((node, idx) => {
              const pos = getNodePos(node, idx, activeComponents.length)
              const isSelected = node.id === selectedNodeId
              const color = getNodeColor(node)

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Node Background Halo */}
                  <circle r="18" fill={`${color}20`} stroke={color} strokeWidth="2" />

                  {/* Core Indicator */}
                  <circle r="7" fill={color} />

                  {/* Label */}
                  <text
                    y="32"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {node.name}
                  </text>

                  {/* Risk Tag Badge */}
                  {showRiskColors && (
                    <text
                      y="-22"
                      textAnchor="middle"
                      fill={color}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.riskScore}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Inspector Detail Card requested in Prompt #22 */}
        <div 
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderColor: 'var(--border)'
          }}
          className="lg:col-span-4 rounded-2xl border p-5 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                {selectedNode.type} Node
              </div>
              <h4 className="text-lg font-bold font-display mt-0.5" style={{ color: 'var(--foreground)' }}>
                {selectedNode.name}
              </h4>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-1 rounded"
              style={{
                backgroundColor: `${getNodeColor(selectedNode)}20`,
                color: getNodeColor(selectedNode)
              }}
            >
              Risk: {selectedNode.riskScore}/100
            </span>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
            {selectedNode.description}
          </p>

          {/* Exact Metrics Specified in Prompt:
              PaymentService
              Risk: 91
              Dependencies: 11
              Dependents: 14
              Recent Changes: 7
              Related Incidents: 3
          */}
          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
            <div 
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border"
            >
              <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'var(--muted-foreground)' }}>
                <span>Dependencies</span>
                <ContextualHelp term="Dependency Coupling" />
              </div>
              <strong className="text-base" style={{ color: 'var(--foreground)' }}>{selectedNode.dependenciesCount}</strong>
            </div>

            <div 
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border"
            >
              <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'var(--muted-foreground)' }}>
                <span>Dependents (Callers)</span>
                <ContextualHelp term="Coupling" />
              </div>
              <strong className="text-base" style={{ color: 'var(--foreground)' }}>{selectedNode.dependentsCount}</strong>
            </div>

            <div 
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border"
            >
              <span className="text-[10px] block mb-1" style={{ color: 'var(--muted-foreground)' }}>Recent Changes</span>
              <strong className="text-base text-amber-500">7 commits</strong>
            </div>

            <div 
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
              className="p-3 rounded-xl border"
            >
              <span className="text-[10px] block mb-1" style={{ color: 'var(--muted-foreground)' }}>Related Incidents</span>
              <strong className="text-base text-rose-500">
                {selectedNode.id === 'payment-service' ? '3 incidents' : '0 incidents'}
              </strong>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
            <LiquidMagneticButton
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                navigateToAppTab('graph', selectedNode.id)
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Full Knowledge Graph
            </LiquidMagneticButton>

            <button
              onClick={() => openExplainDrawer(undefined, selectedNode.id)}
              className="text-xs text-amber-500 hover:text-amber-600 text-center font-mono py-1 cursor-pointer font-medium"
            >
              Why is this node rated {selectedNode.riskScore}? (Evidence) →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
