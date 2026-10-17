import React, { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { LiquidMagneticButton } from '../ui/LiquidMagneticButton'
import {
  Sparkles,
  X,
  Send,
  CornerDownLeft,
  Terminal,
  ShieldAlert,
  Activity,
  GitBranch,
  CheckCircle2,
  FileCode,
  Flame,
  ArrowRight
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: { label: string; actionTab?: string; componentId?: string }[]
  confidence?: number
}

export const AskRepoMindModal: React.FC = () => {
  const {
    askRepoMindOpen,
    setAskRepoMindOpen,
    appTab,
    selectedComponentId,
    assistantInitialPrompt,
    navigateToAppTab
  } = useApp()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Contextual question suggestions based on where user currently is
  const getContextSuggestions = () => {
    switch (appTab) {
      case 'risks':
        return [
          `Why does ${selectedComponentId} have an architectural risk score of 91?`,
          'Which risk should our team prioritize first to prevent downtime?',
          'What is the deterministic formula behind the Scalability score (46)?'
        ]
      case 'incidents':
        return [
          'What is the probable root cause of Incident #INC-2024-892?',
          'How does Deployment #892 relate to the database pool exhaustion?',
          'What would happen if we executed a rollback on commit e8a109f?'
        ]
      case 'graph':
        return [
          `What downstream microservices depend directly on ${selectedComponentId}?`,
          'Are there any circular dependency loops in the payment cluster?',
          'Which node has the highest betweenness centrality score?'
        ]
      case 'blast-radius':
        return [
          `If ${selectedComponentId} crashes, what is the estimated blast radius percentage?`,
          'How can we isolate the Checkout API from Stripe latency spikes?',
          'What is the recovery time objective (RTO) for our core transaction loop?'
        ]
      case 'simulation':
        return [
          'What happens if database query latency spikes by 5x?',
          'How does the system respond to a 10x sudden traffic surge?',
          'Why does the Auth module fail when the primary maintainer departs?'
        ]
      default:
        return [
          'Give me an executive summary of our overall system health (72/100).',
          'What changed in the last 8 commits that introduced risk?',
          'How does RepoMind combine static code analysis with runtime traces?'
        ]
    }
  }

  // Pre-fill prompt if opened with one
  useEffect(() => {
    if (askRepoMindOpen) {
      if (assistantInitialPrompt) {
        handleUserSubmit(assistantInitialPrompt)
      } else if (messages.length === 0) {
        // Welcome message
        setMessages([
          {
            id: 'msg-0',
            role: 'assistant',
            content: `Hello! I'm RepoMind's Software Intelligence Assistant. I am actively analyzing **${selectedComponentId}** in your current **${appTab}** workspace.\n\nAsk me about architecture coupling, incident root causes, blast radiuses, or how to remediate high-risk code paths with evidence.`,
            timestamp: 'Just now',
            citations: [
              { label: 'View Knowledge Graph', actionTab: 'graph' },
              { label: 'Inspect Incidents', actionTab: 'incidents' }
            ]
          }
        ])
      }
    }
  }, [askRepoMindOpen, assistantInitialPrompt])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleUserSubmit = (queryText: string) => {
    if (!queryText.trim()) return

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: 'Just now'
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate intelligent context-aware response
    setTimeout(() => {
      let reply = ''
      let citations: { label: string; actionTab?: string; componentId?: string }[] = []
      let confidence = 94

      const lower = queryText.toLowerCase()

      if (lower.includes('why') && (lower.includes('risk') || lower.includes('payment'))) {
        reply = `**PaymentService** is flagged at **91/100 Critical Risk** due to a combination of 3 correlated factors:\n\n1. **High Coupling Degree:** 11 downstream modules call PaymentService synchronously on the critical checkout path.\n2. **Database Transaction Contention:** In commit \`e8a109f\`, external Stripe HTTP calls were wrapped inside an active \`db.beginTransaction()\` lock, causing connection hold times to surge from 6ms to 1,420ms.\n3. **Code Churn Volatility:** +64% code churn occurred in \`src/payment/settlement.ts\` within 14 days by a single author (Bus Factor = 1).\n\nRepoMind predicts a **89% cascading failure probability** to OrderService if this connection pool lock is not remediated.`
        citations = [
          { label: 'View Risk RSK-1049 Evidence', actionTab: 'risks', componentId: 'payment-service' },
          { label: 'Review AI Remediation Patch', actionTab: 'remediation', componentId: 'payment-service' }
        ]
        confidence = 94
      } else if (lower.includes('incident') || lower.includes('root cause') || lower.includes('cause')) {
        reply = `**Root Cause for Incident #INC-2024-892 (Confidence: 92%):**\n\nAt 14:31 UTC, **Deployment #892** released commit \`e8a109f\` (*"perf(payment): rewrite transaction settlement loop"*). The new code introduced un-indexed locking queries on \`PostgresPrimary\` while synchronously waiting on external third-party payment confirmations.\n\n**Causal Chain:**\n\`Deployment #892\` ➔ \`PaymentService Lock Loop\` ➔ \`Postgres Pool Saturation (98%)\` ➔ \`504 Gateway Timeouts on APIGateway\` ➔ \`Checkout Drop (31.4% error rate)\`.\n\n**Counterfactual Analysis:** A rollback to commit \`c9118d2\` is simulated to restore error rates to under 3.8% within 90 seconds.`
        citations = [
          { label: 'Open Incident Room #INC-2024-892', actionTab: 'incidents' },
          { label: 'Inspect Root Cause Graph', actionTab: 'root-cause' }
        ]
        confidence = 92
      } else if (lower.includes('blast radius') || lower.includes('what breaks') || lower.includes('fails')) {
        reply = `**Simulated Blast Radius:**\n\nIf **PaymentService** fails, the cascade impacts **68% of core customer transactions**:\n\n- **Tier 1 (Direct Synchronous Callers):** \`OrderService\` (gRPC timeout), \`APIGateway\` (504 response)\n- **Tier 2 (Transitive Impact):** \`CheckoutFrontend\` (spinner freeze), \`InvoiceWorker\`\n- **Tier 3 (Peripheral):** \`NotificationWorker\` (delayed receipt emails)\n\nRecommended safeguard: Inject an asynchronous queue decouple with a localized resilient Circuit Breaker.`
        citations = [
          { label: 'Launch Blast Radius Simulator', actionTab: 'blast-radius', componentId: 'payment-service' },
          { label: 'Run Full Failure Simulation', actionTab: 'simulation' }
        ]
        confidence = 96
      } else if (lower.includes('remediat') || lower.includes('fix') || lower.includes('patch')) {
        reply = `**Recommended Remediation Plan (REM-892):**\n\n1. **Move External Call Outside SQL Transaction:** Stage order status to \`PAYMENT_PENDING\`, commit local DB connection in 2ms, execute Stripe call, then finalize state.\n2. **Inject Circuit Breaker:** 3500ms timeout with automatic fail-safe retry backoff.\n3. **Resulting Validation:** Risk score drops from **91 ➔ 67**, DB hold duration drops from **1,420ms ➔ 5.8ms**, and overall system health increases to **88/100**.`
        citations = [
          { label: 'View Code Patch Diff', actionTab: 'remediation', componentId: 'payment-service' },
          { label: 'Run Validation Suite', actionTab: 'validation' }
        ]
        confidence = 98
      } else {
        reply = `**RepoMind Analysis for "${queryText}":**\n\nBased on your active repository AST, Git change history, and telemetry signals:\n\n- **Monitored Services:** 10 components, 13 inter-service dependencies\n- **Critical Hotspot:** \`PaymentService\` connected with \`PostgresPrimary\`\n- **Deterministic Metric:** Cyclomatic complexity = 38 (exceeding safety threshold of 15)\n- **Operational Status:** 1 active P0 incident under investigation\n\nWould you like me to guide you through applying the verified remediation patch or running a rollback simulation?`
        citations = [
          { label: 'Go to Overview Dashboard', actionTab: 'overview' },
          { label: 'Inspect Knowledge Graph', actionTab: 'graph' }
        ]
        confidence = 90
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: 'Just now',
          citations,
          confidence
        }
      ])
      setIsTyping(false)
    }, 750)
  }

  if (!askRepoMindOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      onClick={() => setAskRepoMindOpen(false)}
    >
      <div
        className="w-full sm:max-w-xl h-full sm:h-[92vh] sm:rounded-2xl flex flex-col overflow-hidden transition-colors"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--card-shadow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)'
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Ask RepoMind</span>
                <span
                  className="px-1.5 py-0.5 text-[9px] font-mono font-medium rounded"
                  style={{
                    backgroundColor: 'rgba(52, 211, 153, 0.15)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(52, 211, 153, 0.3)'
                  }}
                >
                  AI Context Engine
                </span>
              </div>
              <div className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
                <span>Context:</span>
                <span className="font-medium" style={{ color: 'var(--accent-orange)' }}>{selectedComponentId}</span>
                <span>•</span>
                <span className="capitalize">{appTab}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAskRepoMindOpen(false)}
            className="p-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1"
                    style={{
                      backgroundColor: 'var(--surface-interactive)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-orange)' }} />
                  </div>
                )}

                <div
                  className="max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed"
                  style={
                    isBot
                      ? {
                          backgroundColor: 'var(--surface-interactive)',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)'
                        }
                      : {
                          background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                          color: '#ffffff',
                          boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
                        }
                  }
                >
                  {/* Confidence banner if assistant message */}
                  {isBot && msg.confidence && (
                    <div
                      className="flex items-center justify-between pb-2 mb-2 text-[10px] font-mono"
                      style={{
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      <span className="flex items-center gap-1" style={{ color: 'var(--accent-green)' }}>
                        <CheckCircle2 className="w-3 h-3" />
                        Evidence-Backed Reasoning
                      </span>
                      <span>Confidence: {msg.confidence}%</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Deep link citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div
                      className="mt-3 pt-2.5 flex flex-wrap gap-2"
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      {msg.citations.map((cite, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setAskRepoMindOpen(false)
                            if (cite.actionTab) {
                              navigateToAppTab(cite.actionTab as any, cite.componentId)
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            color: 'var(--accent-orange)',
                            border: '1px solid rgba(245, 158, 11, 0.25)'
                          }}
                        >
                          <span>{cite.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-right mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-mono p-2" style={{ color: 'var(--muted-foreground)' }}>
              <Sparkles className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-orange)' }} />
              <span>RepoMind Reasoning Engine correlating traces & AST...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div
          className="p-3"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderTop: '1px solid var(--border)'
          }}
        >
          <div className="text-[10px] uppercase font-mono tracking-wider mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Suggested for this view:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {getContextSuggestions().map((sug, i) => (
              <button
                key={i}
                onClick={() => handleUserSubmit(sug)}
                className="px-2.5 py-1 rounded-lg text-left text-[11px] transition-colors truncate max-w-full hover:opacity-80"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  color: 'var(--foreground-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div
          className="p-3"
          style={{
            backgroundColor: 'var(--surface-interactive)',
            borderTop: '1px solid var(--border)'
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUserSubmit(input)
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${selectedComponentId} or system reliability...`}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)'
              }}
            />
            <LiquidMagneticButton
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              disabled={!input.trim() || isTyping}
            >
              Ask
            </LiquidMagneticButton>
          </form>
        </div>
      </div>
    </div>
  )
}
