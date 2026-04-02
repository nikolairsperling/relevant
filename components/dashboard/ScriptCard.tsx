'use client'

import { useState } from 'react'
import type { Script } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { PLATFORM_LABELS } from '@/lib/utils'

const FORMAT_LABELS = {
  'talking-head': 'Talking Head',
  'b-roll': 'B-Roll',
  'screen-recording': 'Screen Recording',
  'text-on-screen': 'Text on Screen',
} as const

interface ScriptCardProps {
  script: Script
}

export function ScriptCard({ script }: ScriptCardProps) {
  const [copied, setCopied] = useState(false)

  const fullScript = `HOOK:\n${script.hook}\n\nPROBLEM:\n${script.problem}\n\nINSIGHT:\n${script.insight}\n\nCTA:\n${script.cta}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-border rounded-lg bg-bg-surface space-y-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Badge variant="platform">{PLATFORM_LABELS[script.platform]}</Badge>
          <Badge variant="default">{FORMAT_LABELS[script.format]}</Badge>
          <Badge variant="default">{script.durationSec}s</Badge>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          {copied ? 'Kopiert' : 'Skript kopieren'}
        </button>
      </div>

      {/* Script Sections */}
      {[
        { label: 'Hook (0‒3s)', content: script.hook },
        { label: 'Problem', content: script.problem },
        { label: 'Insight', content: script.insight },
        { label: 'CTA → Freebie', content: script.cta },
      ].map((section, i) => (
        <div
          key={section.label}
          className={`px-5 py-4 space-y-1 ${
            i < 3 ? 'border-b border-border' : ''
          }`}
        >
          <p className="text-xs text-text-muted uppercase tracking-widest">
            {section.label}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {section.content}
          </p>
        </div>
      ))}
    </div>
  )
}
