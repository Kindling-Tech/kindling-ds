import { useRef, useEffect, useMemo } from 'react'

interface LearningSphereProps {
  dotCount: number
  highlightIndices?: Set<number>
  size?: number
  activeRadius?: number
  inactiveRadius?: number
  rotationSpeed?: number
  phaseOffset?: number
  fillDuration?: number
  onFillProgress?: (progress: number) => void
}

function generatePoints(count: number) {
  if (count <= 1) return count === 1 ? [{ x: 0, y: 0, z: 0 }] : []
  const golden = Math.PI * (3 - Math.sqrt(5))
  const points: { x: number; y: number; z: number }[] = []
  for (let i = 0; i < count; i++) {
    const yNorm = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - yNorm * yNorm)
    const theta = golden * i
    points.push({ x: Math.cos(theta) * r, y: yNorm, z: Math.sin(theta) * r })
  }
  return points
}

function mapDotCount(learnings: number): number {
  if (learnings <= 150) return learnings
  if (learnings <= 400) return 150 + Math.round((learnings - 150) / 5)
  return 400
}

function LearningSphere({
  dotCount,
  highlightIndices,
  size = 70,
  activeRadius = 2,
  inactiveRadius = 1.5,
  rotationSpeed = 0.002,
  phaseOffset = 0,
  fillDuration = 0,
  onFillProgress,
}: LearningSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(phaseOffset)
  const startTimeRef = useRef<number | null>(null)
  const onFillProgressRef = useRef(onFillProgress)
  onFillProgressRef.current = onFillProgress

  const mappedCount = useMemo(() => mapDotCount(dotCount), [dotCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const center = size / 2
    const sphereRadius = size * 0.4
    const tiltX = 0.4

    const cosX = Math.cos(tiltX)
    const sinX = Math.sin(tiltX)

    startTimeRef.current = null

    let animId: number

    const draw = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp

      // Determine current dot count — recompute positions for this count
      let currentCount = mappedCount

      if (fillDuration > 0) {
        const elapsed = (timestamp - startTimeRef.current) / 1000
        const progress = Math.min(elapsed / fillDuration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        currentCount = Math.max(2, Math.floor(eased * mappedCount))
        onFillProgressRef.current?.(eased)
      }

      // Regenerate positions for the current count so every dot
      // is placed as if this were the final sphere size
      const points = generatePoints(currentCount)

      angleRef.current += rotationSpeed

      const cosY = Math.cos(angleRef.current)
      const sinY = Math.sin(angleRef.current)

      const projected = points.map((p, i) => {
        const x1 = p.x * cosY - p.z * sinY
        const z1 = p.x * sinY + p.z * cosY
        const y1 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX
        const depth = (z2 + 1) / 2
        return {
          x: center + x1 * sphereRadius,
          y: center + y1 * sphereRadius,
          depth,
          index: i,
        }
      })

      projected.sort((a, b) => a.depth - b.depth)

      ctx.clearRect(0, 0, size, size)

      for (const pt of projected) {
        const isActive = highlightIndices?.has(pt.index)
        const radius = isActive
          ? activeRadius * (0.6 + pt.depth * 0.4)
          : inactiveRadius * (0.5 + pt.depth * 0.5)
        const opacity = isActive
          ? 0.85 + pt.depth * 0.15
          : 0.3 + pt.depth * 0.5

        ctx.beginPath()
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 104, 0, ${opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(animId)
  }, [size, activeRadius, inactiveRadius, rotationSpeed, highlightIndices, fillDuration, mappedCount])

  return <canvas ref={canvasRef} className="pointer-events-none" />
}

export { LearningSphere, mapDotCount }
