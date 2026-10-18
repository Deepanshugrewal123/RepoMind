import React, { useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'

interface ReactiveIntelligenceFieldProps {
  revealArchitectureHints?: boolean
  className?: string
  intensity?: number // 0.1 to 1.0
}

interface ContourSignal {
  lineIndex: number
  progress: number
  speed: number
  length: number
  color: string
}

interface ArchNode {
  label: string
  tag: string
  xPercent: number
  yPercent: number
  color: string
  pulse: number
}

export const ReactiveIntelligenceField: React.FC<ReactiveIntelligenceFieldProps> = ({
  revealArchitectureHints = true,
  className = '',
  intensity = 0.9
}) => {
  const { effectiveTheme } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    vx: 0,
    vy: 0
  })
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const isMobile = width < 768
    const maxDpr = isMobile ? 1.5 : 2.0
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)

    let cachedRect = canvas.getBoundingClientRect()
    const updateCachedRect = () => {
      if (canvas) {
        cachedRect = canvas.getBoundingClientRect()
      }
    }

    const resize = () => {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      updateCachedRect()
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX - cachedRect.left
      mouseRef.current.targetY = e.clientY - cachedRect.top
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000
      mouseRef.current.targetY = -1000
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Architectural subtle anchor points
    const archNodes: ArchNode[] = [
      { label: 'api_edge::envoy', tag: 'GW-01', xPercent: 0.16, yPercent: 0.28, color: '#38bdf8', pulse: 0 },
      { label: 'service::payment', tag: 'SRV-PAY', xPercent: 0.44, yPercent: 0.42, color: '#f59e0b', pulse: 1.2 },
      { label: 'service::orders', tag: 'SRV-ORD', xPercent: 0.65, yPercent: 0.26, color: '#fb923c', pulse: 2.1 },
      { label: 'data::postgres_cluster', tag: 'DB-PG', xPercent: 0.82, yPercent: 0.58, color: '#34d399', pulse: 3.4 },
      { label: 'event::kafka_bus', tag: 'BUS-EVT', xPercent: 0.32, yPercent: 0.66, color: '#a855f7', pulse: 0.8 },
      { label: 'cache::redis_shards', tag: 'CACHE-R6', xPercent: 0.86, yPercent: 0.32, color: '#2dd4bf', pulse: 1.9 }
    ]

    // 2. Data Signals travelling along landscape contours
    const NUM_CONTOURS = 14
    const signals: ContourSignal[] = Array.from({ length: 6 }, (_, i) => ({
      lineIndex: Math.floor(Math.random() * NUM_CONTOURS),
      progress: Math.random() * width,
      speed: 0.5 + Math.random() * 0.7,
      length: 90 + Math.random() * 120,
      color: i % 2 === 0 ? '#f59e0b' : '#34d399'
    }))

    let time = 0
    let isVisible = !document.hidden
    let isInViewport = true

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && isInViewport && window.scrollY <= height + 50 && !prefersReducedMotion) {
        if (!animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render)
        }
      } else if ((!isVisible || window.scrollY > height + 50) && animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined' && canvas) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInViewport = entry.isIntersecting
          if (isInViewport && isVisible && window.scrollY <= 300 && !prefersReducedMotion) {
            if (!animFrameRef.current) {
              animFrameRef.current = requestAnimationFrame(render)
            }
          } else if ((!isInViewport || window.scrollY > 300) && animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current)
            animFrameRef.current = null
          }
        },
        { threshold: 0 }
      )
      observer.observe(canvas)
    }

    const handleScrollCheck = () => {
      if (window.scrollY <= 300 && isInViewport && isVisible && !prefersReducedMotion) {
        if (!animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(render)
        }
      } else if (window.scrollY > 300 && animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
    window.addEventListener('scroll', handleScrollCheck, { passive: true })

    const render = () => {
      if (!isVisible || !isInViewport || window.scrollY > 300) {
        animFrameRef.current = null
        return
      }

      time += prefersReducedMotion ? 0.001 : 0.006

      // Physical spring easing for mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08

      ctx.clearRect(0, 0, width, height)

      const isDark = effectiveTheme === 'dark'

      // A. Dual Ambient Nebula Lighting Fields (Warm Amber & Restrained Emerald)
      // Top-Left / Center Amber Halo
      const amberGlow = ctx.createRadialGradient(
        width * 0.32,
        height * 0.22,
        20,
        width * 0.32,
        height * 0.22,
        width * 0.55
      )
      amberGlow.addColorStop(0, isDark ? 'rgba(245, 158, 11, 0.085)' : 'rgba(217, 119, 6, 0.065)')
      amberGlow.addColorStop(0.5, isDark ? 'rgba(245, 158, 11, 0.025)' : 'rgba(217, 119, 6, 0.02)')
      amberGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = amberGlow
      ctx.fillRect(0, 0, width, height)

      // Right / Midground Emerald Halo
      const emeraldGlow = ctx.createRadialGradient(
        width * 0.78,
        height * 0.52,
        20,
        width * 0.78,
        height * 0.52,
        width * 0.48
      )
      emeraldGlow.addColorStop(0, isDark ? 'rgba(52, 211, 153, 0.065)' : 'rgba(5, 150, 105, 0.05)')
      emeraldGlow.addColorStop(0.6, isDark ? 'rgba(52, 211, 153, 0.015)' : 'rgba(5, 150, 105, 0.01)')
      emeraldGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = emeraldGlow
      ctx.fillRect(0, 0, width, height)

      // B. Reactive Local Pointer Light Field
      if (mouseRef.current.x > -500) {
        const pointerGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          320
        )
        pointerGlow.addColorStop(0, isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(217, 119, 6, 0.08)')
        pointerGlow.addColorStop(0.5, isDark ? 'rgba(52, 211, 153, 0.04)' : 'rgba(5, 150, 105, 0.03)')
        pointerGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = pointerGlow
        ctx.fillRect(0, 0, width, height)
      }

      // C. 3D Topological Contour Landscape
      const stepY = height / (NUM_CONTOURS - 1)
      const stepX = 28
      const cols = Math.ceil(width / stepX) + 1

      // Function to calculate topological elevation at (x, y)
      const getElevation = (x: number, y: number, lineIdx: number) => {
        // Perspective depth factor (distant lines are flatter, foreground has richer amplitude)
        const depthFactor = (lineIdx / NUM_CONTOURS) * 0.8 + 0.3

        // Natural harmonic waves
        const wave1 = Math.sin(x * 0.0022 + time * 0.9 + lineIdx * 0.3) * 22 * depthFactor
        const wave2 = Math.cos(x * 0.0045 - time * 0.6 + lineIdx * 0.25) * 12 * depthFactor
        const wave3 = Math.sin(x * 0.0012 + y * 0.002 + time * 0.4) * 28 * depthFactor

        // Mouse displacement with cosine falloff
        let mouseDisplacement = 0
        if (mouseRef.current.x > -500) {
          const dx = mouseRef.current.x - x
          const dy = mouseRef.current.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const radius = 260
          if (dist < radius) {
            const bell = Math.cos((dist / radius) * (Math.PI / 2))
            mouseDisplacement = -bell * 32 * intensity * depthFactor
          }
        }

        return wave1 + wave2 + wave3 + mouseDisplacement
      }

      // Render Horizontal Topological Contours
      for (let j = 0; j < NUM_CONTOURS; j++) {
        const baseY = j * stepY
        const depthAlpha = (j / NUM_CONTOURS) * 0.15 + 0.08 // Visible, clear opacity

        ctx.beginPath()

        for (let i = 0; i < cols; i++) {
          const x = i * stepX
          const elev = getElevation(x, baseY, j)
          const y = baseY + elev

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        // Color gradation across depth
        if (isDark) {
          if (j % 5 === 0) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${depthAlpha * 1.3})` // Amber accent contour
          } else if (j % 6 === 0) {
            ctx.strokeStyle = `rgba(52, 211, 153, ${depthAlpha * 1.2})` // Emerald accent contour
          } else {
            ctx.strokeStyle = `rgba(226, 232, 240, ${depthAlpha * 0.95})` // Refined graphite
          }
        } else {
          if (j % 5 === 0) {
            ctx.strokeStyle = `rgba(217, 119, 6, ${depthAlpha * 1.4})`
          } else if (j % 6 === 0) {
            ctx.strokeStyle = `rgba(5, 150, 105, ${depthAlpha * 1.3})`
          } else {
            ctx.strokeStyle = `rgba(30, 41, 59, ${depthAlpha * 1.1})`
          }
        }

        ctx.lineWidth = j % 5 === 0 ? 1.4 : 1.0
        ctx.stroke()
      }

      // D. Vertical Perspective Grid Ribs (Creating 3D surface mesh feel)
      const numRibs = 8
      const ribStepX = width / (numRibs - 1)

      for (let i = 0; i < numRibs; i++) {
        const baseX = i * ribStepX
        ctx.beginPath()

        for (let j = 0; j < NUM_CONTOURS; j++) {
          const baseY = j * stepY
          const elev = getElevation(baseX, baseY, j)
          const y = baseY + elev

          if (j === 0) {
            ctx.moveTo(baseX, y)
          } else {
            ctx.lineTo(baseX, y)
          }
        }

        ctx.strokeStyle = isDark
          ? 'rgba(255, 255, 255, 0.035)'
          : 'rgba(0, 0, 0, 0.04)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // E. Traveling Light Signals (Data pulses flowing along landscape)
      signals.forEach((sig) => {
        sig.progress += sig.speed
        if (sig.progress > width + sig.length) {
          sig.progress = -sig.length
          sig.lineIndex = Math.floor(Math.random() * NUM_CONTOURS)
          sig.speed = 0.5 + Math.random() * 0.7
        }

        const headX = sig.progress
        const tailX = Math.max(0, headX - sig.length)
        const baseY = sig.lineIndex * stepY
        const headElev = getElevation(headX, baseY, sig.lineIndex)
        const tailElev = getElevation(tailX, baseY, sig.lineIndex)

        const grad = ctx.createLinearGradient(tailX, baseY + tailElev, headX, baseY + headElev)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.7, sig.color + (isDark ? '44' : '55'))
        grad.addColorStop(1, sig.color)

        ctx.beginPath()
        ctx.moveTo(tailX, baseY + tailElev)
        ctx.lineTo(headX, baseY + headElev)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.8
        ctx.stroke()

        // Clean illuminated packet at head without software blur fallback
        ctx.beginPath()
        ctx.arc(headX, baseY + headElev, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = sig.color
        ctx.fill()
      })

      // F. Subtle Architecture Hints & Connectivity
      if (revealArchitectureHints) {
        // Draw connective translucent paths between nodes
        for (let i = 0; i < archNodes.length - 1; i++) {
          const n1 = archNodes[i]
          const n2 = archNodes[i + 1]
          const x1 = n1.xPercent * width
          const y1 = n1.yPercent * height
          const x2 = n2.xPercent * width
          const y2 = n2.yPercent * height

          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2 + Math.sin(time + i) * 12

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.quadraticCurveTo(midX, midY, x2, y2)
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.09)'
          ctx.setLineDash([4, 6])
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Draw nodes
        archNodes.forEach((node) => {
          const nx = node.xPercent * width
          const ny = node.yPercent * height
          const pulseVal = Math.sin(time * 2 + node.pulse) * 0.5 + 0.5

          // Outer halo
          ctx.beginPath()
          ctx.arc(nx, ny, 12 + pulseVal * 6, 0, Math.PI * 2)
          ctx.fillStyle = `${node.color}18`
          ctx.fill()

          // Core node dot
          ctx.beginPath()
          ctx.arc(nx, ny, 3.5, 0, Math.PI * 2)
          ctx.fillStyle = node.color
          ctx.fill()

          // Subtle metadata tag
          ctx.font = '10px "JetBrains Mono", monospace'
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.65)'
          ctx.fillText(`[${node.tag}] ${node.label}`, nx + 10, ny - 6)
        })
      }

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScrollCheck)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (observer) {
        observer.disconnect()
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [revealArchitectureHints, intensity, effectiveTheme])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{ opacity: 0.98 }}
    />
  )
}
