import React from 'react'
import { useApp } from '../context/AppContext'
import { ReactiveIntelligenceField } from '../components/ui/ReactiveIntelligenceField'
import { LiquidMagneticButton } from '../components/ui/LiquidMagneticButton'
import { ScrollStoryEngine } from '../components/home/ScrollStoryEngine'
import { ProblemSolutionSection } from '../components/home/ProblemSolutionSection'
import { BentoFeatureShowcase } from '../components/home/BentoFeatureShowcase'
import { InteractiveDemoPreview } from '../components/home/InteractiveDemoPreview'
import { SecurityTrustSection } from '../components/home/SecurityTrustSection'
import { FinalCtaSection } from '../components/home/FinalCtaSection'
import { Footer } from '../components/common/Footer'
import {
  ArrowRight,
  ChevronDown
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const { loadSampleProject } = useApp()

  const scrollToStoryEngine = () => {
    const el = document.getElementById('scroll-story-engine')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      className="relative min-h-screen overflow-x-clip selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-200 transition-colors"
    >
      {/* 1. HERO SECTION: SPACIOUS, EDITORIAL & UNCLUTTERED */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-32 pb-14 sm:pb-16 px-3 sm:px-6 md:px-8 overflow-hidden">
        {/* Living Reactive Intelligence Topology Field */}
        <ReactiveIntelligenceField intensity={0.9} revealArchitectureHints={true} />

        {/* Ambient Subtle Amber Nebula */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Editorial Technical Framing */}
        <div
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--glass-bg)'
          }}
          className="relative z-10 max-w-4xl mx-auto text-center p-5 sm:p-10 md:p-12 lg:p-14 rounded-3xl border backdrop-blur-md space-y-5 sm:space-y-7 shadow-2xl"
        >
          {/* Corner Coordinate Indicators */}
          <span
            className="absolute top-2.5 sm:top-3.5 left-3 sm:left-4 text-[9px] sm:text-[10px] font-mono select-none"
            style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
          >
            + [SYS // 37.77]
          </span>
          <span
            className="absolute top-2.5 sm:top-3.5 right-3 sm:right-4 text-[9px] sm:text-[10px] font-mono select-none"
            style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
          >
            LATENCY // 14ms +
          </span>
          <span
            className="absolute bottom-2.5 sm:bottom-3.5 left-3 sm:left-4 text-[9px] sm:text-[10px] font-mono select-none hidden sm:block"
            style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
          >
            + [AST // READY]
          </span>
          <span
            className="absolute bottom-2.5 sm:bottom-3.5 right-3 sm:right-4 text-[9px] sm:text-[10px] font-mono select-none hidden sm:block"
            style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
          >
            ENV // PRODUCTION +
          </span>

          {/* Technical Eyebrow (Wraps cleanly on narrow mobile) */}
          <div
            style={{
              backgroundColor: 'var(--surface-interactive)',
              borderColor: 'var(--border)'
            }}
            className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono tracking-wider uppercase shadow-sm max-w-full text-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="text-amber-500 font-semibold shrink-0">[SYS // 37.77]</span>
            <span className="opacity-30 hidden sm:inline">|</span>
            <span style={{ color: 'var(--foreground-secondary)' }}>
              SOFTWARE INTELLIGENCE / SYSTEM 01
            </span>
          </div>

          {/* Main Headline: Space Grotesk + Newsreader Italic Serif */}
          <h1
            style={{ color: 'var(--foreground)' }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight font-display leading-[1.1] sm:leading-[1.03] break-words"
          >
            Understand your software.<br />
            <span className="font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400">
              Before it breaks.
            </span>
          </h1>

          {/* Calibrated Supporting Copy */}
          <p
            style={{ color: 'var(--foreground-secondary)' }}
            className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-sans px-1"
          >
            RepoMind analyzes your codebase, architecture, dependencies and runtime signals to uncover risks, investigate failures, and guide you toward safer fixes.
          </p>

          {/* Two Balanced, High-Intent CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <LiquidMagneticButton
              variant="primary"
              size="lg"
              onClick={scrollToStoryEngine}
              icon={<ChevronDown className="w-4 h-4" />}
            >
              Explore RepoMind
            </LiquidMagneticButton>

            <LiquidMagneticButton
              variant="secondary"
              size="lg"
              onClick={loadSampleProject}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Sample Project
            </LiquidMagneticButton>
          </div>
        </div>

        {/* Subtle Bottom Scroll Indicator */}
        <div className="pt-8 sm:pt-10 z-10">
          <button
            onClick={scrollToStoryEngine}
            style={{
              backgroundColor: 'var(--surface-interactive)',
              borderColor: 'var(--border)'
            }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-[10px] sm:text-xs font-mono text-[var(--muted-foreground)] hover:text-amber-400 transition-all hover:scale-105 cursor-pointer shadow-sm animate-bounce"
            aria-label="Scroll down to explore architecture"
          >
            <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
            <span>SCROLL TO EXPLORE ARCHITECTURE ↓</span>
          </button>
        </div>
      </section>

      {/* 2. SCROLL-DRIVEN STORYTELLING ENGINE */}
      <ScrollStoryEngine />

      {/* 3. PROBLEM VS SOLUTION STORY */}
      <ProblemSolutionSection />

      {/* 4. BENTO FEATURE SHOWCASE */}
      <BentoFeatureShowcase />

      {/* 5. FOCUSED INTERACTIVE DEMO PREVIEW (Progressive Disclosure) */}
      <InteractiveDemoPreview />

      {/* 6. SECURITY & TRUST VERIFIED CLAIMS */}
      <SecurityTrustSection />

      {/* 7. FINAL HEROIC CALL TO ACTION */}
      <FinalCtaSection />

      {/* 8. PROFESSIONAL PRODUCTION FOOTER */}
      <Footer />
    </div>
  )
}
