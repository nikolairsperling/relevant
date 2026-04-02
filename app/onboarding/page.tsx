'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingData, Platform, Role, Goal } from '@/lib/types'
import { PLATFORM_LABELS, ROLE_LABELS, ROLE_DESCRIPTIONS, GOAL_LABELS } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const TOTAL_STEPS = 5

const initialData: OnboardingData = {
  platforms: [],
  role: null,
  goals: [],
  profileUrl: '',
  bioText: '',
  hasFreebie: false,
  freebieText: '',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [loading, setLoading] = useState(false)

  const canProceed = () => {
    if (step === 1) return data.platforms.length > 0
    if (step === 2) return data.role !== null
    if (step === 3) return true // Profil-Input optional
    if (step === 4) return true // Freebie optional
    if (step === 5) return data.goals.length > 0
    return false
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Analyse starten – im echten System: API-Call
    // Für jetzt: zu Mock-Dashboard weiterleiten
    await new Promise((r) => setTimeout(r, 2000))
    router.push('/analyse/demo')
  }

  const togglePlatform = (p: Platform) => {
    setData((d) => ({
      ...d,
      platforms: d.platforms.includes(p)
        ? d.platforms.filter((x) => x !== p)
        : [...d.platforms, p],
    }))
  }

  const toggleGoal = (g: Goal) => {
    setData((d) => {
      const has = d.goals.includes(g)
      if (has) return { ...d, goals: d.goals.filter((x) => x !== g) }
      if (d.goals.length >= 2) return { ...d, goals: [d.goals[1], g] }
      return { ...d, goals: [...d.goals, g] }
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link href="/" className="text-sm font-semibold tracking-widest uppercase">
          RELEVANT<span className="text-text-secondary">.</span>
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 w-8 rounded-full transition-all duration-300 ${
                i < step ? 'bg-white' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-text-muted w-20 text-right">
          {step} / {TOTAL_STEPS}
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-10 animate-in">

          {/* Step 1: Platform */}
          {step === 1 && (
            <StepSection
              label="Schritt 1"
              title="Wähle die Plattform."
              hint="Jede Plattform folgt eigenen Regeln. RELEVANT. bewertet sie getrennt."
            >
              <div className="grid grid-cols-3 gap-3">
                {(['instagram', 'tiktok', 'linkedin'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`border rounded-lg p-4 text-left transition-all ${
                      data.platforms.includes(p)
                        ? 'border-white bg-bg-elevated'
                        : 'border-border bg-bg-surface hover:border-text-secondary'
                    }`}
                  >
                    <div className="text-lg mb-1">
                      {p === 'instagram' ? '📷' : p === 'tiktok' ? '🎵' : '💼'}
                    </div>
                    <p className="text-sm font-medium">{PLATFORM_LABELS[p]}</p>
                  </button>
                ))}
              </div>
            </StepSection>
          )}

          {/* Step 2: Role */}
          {step === 2 && (
            <StepSection
              label="Schritt 2"
              title="Wie verdienst du dein Geld?"
              hint="Das System unterscheidet – Hooks, CTAs und Bewertung sind unterschiedlich."
            >
              <div className="space-y-3">
                {(['creator', 'coach', 'dienstleister'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setData((d) => ({ ...d, role: r }))}
                    className={`w-full border rounded-lg p-4 text-left transition-all ${
                      data.role === r
                        ? 'border-white bg-bg-elevated'
                        : 'border-border bg-bg-surface hover:border-text-secondary'
                    }`}
                  >
                    <p className="text-sm font-medium">{ROLE_LABELS[r]}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {ROLE_DESCRIPTIONS[r]}
                    </p>
                  </button>
                ))}
              </div>
            </StepSection>
          )}

          {/* Step 3: Profile Input */}
          {step === 3 && (
            <StepSection
              label="Schritt 3"
              title="Dein Profil."
              hint="Kein Plattform-Login. Kein Scraping. Du gibst an, wir analysieren."
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-text-muted uppercase tracking-widest">
                    Profil-Link (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/deinprofil"
                    value={data.profileUrl}
                    onChange={(e) =>
                      setData((d) => ({ ...d, profileUrl: e.target.value }))
                    }
                    className="w-full bg-bg-surface border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-text-secondary transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-text-muted uppercase tracking-widest">
                    Bio / Headline
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Kopiere deine Bio oder Headline hier hinein. Wir bewerten Struktur, nicht Stil."
                    value={data.bioText}
                    onChange={(e) =>
                      setData((d) => ({ ...d, bioText: e.target.value }))
                    }
                    className="w-full bg-bg-surface border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-text-secondary transition-colors resize-none"
                  />
                </div>
              </div>
            </StepSection>
          )}

          {/* Step 4: Freebie */}
          {step === 4 && (
            <StepSection
              label="Schritt 4"
              title="Freebie vorhanden?"
              hint="Profile ohne klar kommuniziertes Freebie verlieren Aufmerksamkeit schneller."
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      setData((d) => ({ ...d, hasFreebie: true }))
                    }
                    className={`border rounded-lg p-4 text-left transition-all ${
                      data.hasFreebie
                        ? 'border-white bg-bg-elevated'
                        : 'border-border bg-bg-surface hover:border-text-secondary'
                    }`}
                  >
                    <p className="text-sm font-medium">Ja</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Ich habe ein Freebie
                    </p>
                  </button>
                  <button
                    onClick={() =>
                      setData((d) => ({ ...d, hasFreebie: false, freebieText: '' }))
                    }
                    className={`border rounded-lg p-4 text-left transition-all ${
                      !data.hasFreebie
                        ? 'border-white bg-bg-elevated'
                        : 'border-border bg-bg-surface hover:border-text-secondary'
                    }`}
                  >
                    <p className="text-sm font-medium">Keins</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Noch kein Freebie
                    </p>
                  </button>
                </div>

                {data.hasFreebie && (
                  <div className="space-y-1.5 animate-in">
                    <label className="text-xs text-text-muted uppercase tracking-widest">
                      Kurzbeschreibung (1–2 Sätze)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Was ist dein Freebie? Für wen ist es gedacht?"
                      value={data.freebieText}
                      onChange={(e) =>
                        setData((d) => ({ ...d, freebieText: e.target.value }))
                      }
                      className="w-full bg-bg-surface border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-text-secondary transition-colors resize-none"
                    />
                  </div>
                )}
              </div>
            </StepSection>
          )}

          {/* Step 5: Goal */}
          {step === 5 && (
            <StepSection
              label="Schritt 5"
              title="Was soll dein Content bewirken?"
              hint="Zu viele Ziele machen Content beliebig. Wähle maximal zwei."
            >
              <div className="space-y-2">
                {(['follower', 'engagement', 'kommentare', 'anfragen', 'umsatz'] as Goal[]).map(
                  (g) => (
                    <button
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className={`w-full border rounded-lg px-4 py-3 text-left flex items-center justify-between transition-all ${
                        data.goals.includes(g)
                          ? 'border-white bg-bg-elevated'
                          : 'border-border bg-bg-surface hover:border-text-secondary'
                      }`}
                    >
                      <span className="text-sm">{GOAL_LABELS[g]}</span>
                      {data.goals.includes(g) && (
                        <span className="text-xs text-text-secondary">
                          {data.goals.indexOf(g) + 1}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </StepSection>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Zurück
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={!canProceed()}
              loading={loading}
            >
              {step === TOTAL_STEPS ? 'Analyse starten' : 'Weiter'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function StepSection({
  label,
  title,
  hint,
  children,
}: {
  label: string
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-text-muted uppercase tracking-widest">{label}</p>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-text-secondary">{hint}</p>
      </div>
      {children}
    </div>
  )
}
