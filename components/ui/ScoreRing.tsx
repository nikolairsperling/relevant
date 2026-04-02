'use client'

import { useEffect, useState } from 'react'
import { getScoreStroke, getScoreLabel } from '@/lib/utils'

interface ScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

const SIZE_CONFIG = {
  sm: { viewBox: 120, cx: 60, cy: 60, r: 44, strokeWidth: 4, fontSize: 'text-2xl', subSize: 'text-[10px]' },
  md: { viewBox: 160, cx: 80, cy: 80, r: 60, strokeWidth: 5, fontSize: 'text-3xl', subSize: 'text-xs' },
  lg: { viewBox: 200, cx: 100, cy: 100, r: 80, strokeWidth: 6, fontSize: 'text-5xl', subSize: 'text-sm' },
}

export function ScoreRing({ score, size = 'md', showLabel = true, animated = true }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)
  const [mounted, setMounted] = useState(false)

  const config = SIZE_CONFIG[size]
  const circumference = 2 * Math.PI * config.r
  const offset = circumference - (displayScore / 100) * circumference
  const strokeColor = getScoreStroke(score)

  useEffect(() => {
    setMounted(true)
    if (animated) {
      // Animiere den Score-Counter
      let start = 0
      const duration = 1200
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        start = Math.round(eased * score)
        setDisplayScore(start)
        if (progress < 1) requestAnimationFrame(animate)
      }

      const raf = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(raf)
    }
  }, [score, animated])

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      <div className="relative">
        <svg
          width={config.viewBox}
          height={config.viewBox}
          viewBox={`0 0 ${config.viewBox} ${config.viewBox}`}
          aria-label={`Relevant Score: ${score} von 100`}
        >
          {/* Track */}
          <circle
            cx={config.cx}
            cy={config.cy}
            r={config.r}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress */}
          {mounted && (
            <circle
              cx={config.cx}
              cy={config.cy}
              r={config.r}
              fill="none"
              stroke={strokeColor}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                transition: animated ? 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              }}
            />
          )}
          {/* Score Text */}
          <text
            x={config.cx}
            y={config.cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontFamily="inherit"
            fontWeight="600"
            fontSize={size === 'sm' ? '22' : size === 'md' ? '28' : '40'}
          >
            {displayScore}
          </text>
          {/* /100 */}
          <text
            x={config.cx}
            y={config.cy + (size === 'sm' ? 16 : size === 'md' ? 20 : 28)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#555555"
            fontFamily="inherit"
            fontSize={size === 'sm' ? '9' : size === 'md' ? '11' : '14'}
          >
            / 100
          </text>
        </svg>
      </div>

      {showLabel && (
        <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">
          {getScoreLabel(score)}
        </p>
      )}
    </div>
  )
}
