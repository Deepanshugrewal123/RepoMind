import React from 'react'
import { InteractiveGraphDemo } from '../../home/InteractiveGraphDemo'
import { useApp } from '../../../context/AppContext'
import { Network, Maximize2, Minimize2, Sparkles, Filter } from 'lucide-react'

export const KnowledgeGraphView: React.FC = () => {
  const { focusMode, setFocusMode } = useApp()

  return (
    <div className="space-y-6 pb-20">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--accent-orange)' }}>
              [GRAPH // 02.DEPENDENCY_TOPOLOGY]
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display" style={{ color: 'var(--foreground)' }}>
            Interactive Software Knowledge Graph
          </h2>
          <p className="text-xs sm:text-sm font-sans" style={{ color: 'var(--foreground-secondary)' }}>
            Directed topological graph of codebase components, database models, queues, and RPC dependencies.
          </p>
        </div>

        <button
          onClick={() => setFocusMode(!focusMode)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer flex items-center gap-1.5"
          style={{
            backgroundColor: focusMode ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-interactive)',
            color: focusMode ? 'var(--accent-orange)' : 'var(--foreground)',
            borderColor: focusMode ? 'var(--accent-orange)' : 'var(--border)'
          }}
        >
          {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{focusMode ? 'Exit Focus Mode' : 'Immersive Focus Mode'}</span>
        </button>
      </div>

      {/* Embedded interactive knowledge graph */}
      <InteractiveGraphDemo />
    </div>
  )
}
