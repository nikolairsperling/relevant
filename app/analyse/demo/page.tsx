'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  'Positionierung',
  'Relevanz-Signale',
  'Hook-Struktur',
  'Freebie-Anbindung',
  'Score wird berechnet',
]

export default function AnalysePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(i)
        }, i * 600)
      )
    })

    timers.push(
      setTimeout(() => {
        setDone(true)
        setTimeout(() => router.push('/dashboard'), 600)
      }, STEPS.length * 600 + 400)
    )

    return () => timers.forEach(clearTimeout)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-10 text-center">

        {/* Animated indicator */}
        <div className="flex justify-center">
          <div className={`w-12 h-12 rounded-full border-2 border-t-white border-white/20 transition-all duration-500 ${done ? 'border-white animate-none' : 'animate-spin'}`} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold">
            {done ? 'Analyse abgeschlossen.' : 'Analyse läuft.'}
          </h1>
          <p className="text-sm text-text-secondary">
            {done
              ? 'Dein Relevant Score ist bereit.'
              : 'Das dauert wenige Sekunden.'}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-2 text-left">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-all duration-300 ${
                i <= currentStep ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                  i < currentStep || done
                    ? 'bg-score-high'
                    : i === currentStep
                    ? 'bg-white'
                    : 'bg-border'
                }`}
              />
              <span className="text-sm text-text-secondary">
                Wir prüfen gerade: {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
