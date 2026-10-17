import React from 'react'
import { useApp, RouteType } from '../../context/AppContext'
import { Mail, ShieldCheck, Heart } from 'lucide-react'
import { GithubIcon } from '../ui/Icons'

export const Footer: React.FC = () => {
  const { setCurrentRoute } = useApp()

  const links: { label: string; route: RouteType }[] = [
    { label: 'Product', route: 'product' },
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'Interactive Demo', route: 'demo' },
    { label: 'Intelligence Capabilities', route: 'intelligence' },
    { label: 'Security & Trust', route: 'security' },
    { label: 'Documentation', route: 'docs' },
    { label: 'About RepoMind', route: 'about' }
  ]

  return (
    <footer 
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
        color: 'var(--muted-foreground)'
      }}
      className="w-full border-t py-16 px-4 sm:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div 
                style={{ backgroundColor: 'var(--surface-interactive)', borderColor: 'var(--border)' }}
                className="w-7 h-7 rounded-lg border flex items-center justify-center"
              >
                <div className="w-3 h-3 rounded-full border-2 border-amber-500" />
              </div>
              <span className="font-bold text-lg tracking-tight font-display" style={{ color: 'var(--foreground)' }}>RepoMind</span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              AI-Powered Software Intelligence & Reliability Platform. Understand codebase architecture, predict risk vectors, investigate production incidents, and validate remediation with evidence.
            </p>
            <div className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
              Operating Intelligence Layer for Modern Engineering Teams.
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--foreground)' }}>
              Platform & Resources
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {links.map((link) => (
                <button
                  key={link.route}
                  onClick={() => setCurrentRoute(link.route)}
                  className="text-left hover:text-amber-500 transition-colors py-1 cursor-pointer"
                  style={{ color: 'var(--foreground-secondary)' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Engineering & Contact */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider font-semibold" style={{ color: 'var(--foreground)' }}>
              Engineering & Transparency
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
              Designed around progressive disclosure, deterministic AST extraction, and continuous closed-loop learning.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs font-mono">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                <GithubIcon className="w-4 h-4 text-amber-500" />
                <span>GitHub Repository</span>
              </a>
              <div className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>contact@repomind.io</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4" style={{ color: 'var(--muted-foreground)' }}>
          <div>
            © {new Date().getFullYear()} RepoMind. All rights reserved. Built for engineering reliability.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Evidence-First UX</span>
            <span>•</span>
            <span>Deterministic AST</span>
            <span>•</span>
            <span>Zero Code Storage</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
