'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Hook } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PLATFORM_LABELS } from '@/lib/utils'

const HOOK_TYPE_LABELS = {
  contrarian: 'Contrarian',
  diagnostic: 'Diagnostisch',
  authority: 'Autorität',
  outcome: 'Outcome',
} as const

interface HookListProps {
  hooks: Hook[]
  isLimited?: boolean
  userPlan?: string
}

export function HookList({ hooks, userPlan = 'free' }: HookListProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const isFree = userPlan === 'free'
  const visibleHooks = isFree ? hooks.slice(0, 3) : hooks
  const lockedHooks = isFree ? hooks.slice(3) : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
            Personalisierte Hooks
          </p>
          <p className="text-xs text-text-secondary">
            Auf dein Ziel und deine Plattform abgestimmt.
          </p>
        </div>
        <Badge variant="default">{hooks.length} total</Badge>
      </div>
      <div className="space-y-2">
        {visibleHooks.map((hook) => (
          <div
            key={hook.id}
            className="group border border-border rounded-lg bg-bg-surface p-4 space-y-3 hover:border-text-muted transition-colors"
          >
            <p className="text-sm leading-relaxed">{hook.text}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="platform">{PLATFORM_LABELS[hook.platform]}</Badge>
                <Badge variant="default">{HOOK_TYPE_LABELS[hook.hookType]}</Badge>
              </div>
              <button
                onClick={() => handleCopy(hook.id, hook.text)}
                className="text-xs text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"
              >
                {copied === hook.id ? 'Kopiert' : 'Kopieren'}
              </button>
            </div>
            {hook.ctaLogic && (
              <p className="text-xs text-text-muted border-t border-border pt-2">
                CTA: {hook.ctaLogic}
              </p>
            )}
          </div>
        ))}

        {lockedHooks.length > 0 && (
          <div className="relative rounded-lg overflow-hidden">
            <div className="space-y-2 blur-sm pointer-events-none select-none" aria-hidden="true">
              {lockedHooks.map((hook) => (
                <div
                  key={hook.id}
                  className="border border-border rounded-lg bg-bg-surface p-4 space-y-3"
                >
                  <p className="text-sm leading-relaxed">{hook.text}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="platform">{PLATFORM_LABELS[hook.platform]}</Badge>
                    <Badge variant="default">{HOOK_TYPE_LABELS[hook.hookType]}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/70 backdrop-blur-[1px]">
              <p className="text-sm font-medium">+{lockedHooks.length} weitere Hooks</p>
              <p className="text-xs text-text-secondary text-center max-w-xs">
                Relevanz entsteht durch Wiederholung. Alle Hooks freischalten.
              </p>
              <Button variant="primary" size="sm" asChild>
                <Link href="/konto/plan">Starter freischalten — ab 29 €</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
