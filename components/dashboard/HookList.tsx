'use client'

import { useState } from 'react'
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
}

export function HookList({ hooks, isLimited = false }: HookListProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const displayHooks = isLimited ? hooks.slice(0, 5) : hooks

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
        {isLimited && (
          <Badge variant="default">{hooks.length} total</Badge>
        )}
      </div>

      <div className="space-y-2">
        {displayHooks.map((hook) => (
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
      </div>

      {isLimited && hooks.length > 5 && (
        <div className="border border-border rounded-lg p-4 text-center space-y-2">
          <p className="text-xs text-text-secondary">
            Das ist ein Ausschnitt. Relevanz entsteht durch Wiederholung, nicht durch Zufall.
          </p>
          <Button variant="outline" size="sm">
            Zugang freischalten
          </Button>
        </div>
      )}
    </div>
  )
}
