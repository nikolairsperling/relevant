import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ScoreCategory, Platform, Role, Goal, PricingTier } from './types'

// ─── Class Merging ─────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Score Helpers ─────────────────────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-score-high'
  if (score >= 40) return 'text-score-mid'
  return 'text-score-low'
}

export function getScoreStroke(score: number): string {
  if (score >= 70) return '#22C55E'
  if (score >= 40) return '#EAB308'
  return '#EF4444'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Stark relevant'
  if (score >= 60) return 'Ausbaufähig'
  if (score >= 40) return 'Strukturell schwach'
  return 'Wird ignoriert'
}

export function getScoreDiagnosis(score: number): string {
  if (score >= 80) return 'Dein Profil erzeugt klare Signale.'
  if (score >= 60) return 'Dein Profil ist sichtbar. Aber nicht überzeugend.'
  if (score >= 40) return 'Dein Content ist nicht schlecht. Er ist nur irrelevant strukturiert.'
  return 'Dein Profil erklärt, was du machst – aber nicht, warum man dir folgen sollte.'
}

export function calculateScoreOffset(score: number): number {
  // Circle circumference for r=54: 2 * π * 54 ≈ 339
  const circumference = 339
  return circumference - (score / 100) * circumference
}

// ─── Label Helpers ─────────────────────────────────────────────────────────

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
}

export const ROLE_LABELS: Record<Role, string> = {
  creator: 'Creator',
  coach: 'Coach',
  dienstleister: 'Dienstleister',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  creator: 'Reichweite und Wiedererkennbarkeit',
  coach: 'Autorität und Vertrauen',
  dienstleister: 'Anfragen und Umsatz',
}

export const GOAL_LABELS: Record<Goal, string> = {
  follower: 'Mehr Follower',
  engagement: 'Mehr Engagement',
  kommentare: 'Mehr Kommentare',
  anfragen: 'Mehr Anfragen',
  umsatz: 'Mehr Umsatz',
}

export const CATEGORY_LABELS: Record<ScoreCategory, string> = {
  positioning: 'Positionierung',
  audience: 'Zielgruppe & Angebot',
  hooks: 'Hooks',
  scripts: 'Content-Struktur',
  freebie: 'Freebie & CTA',
}

export const PRIORITY_LABELS = {
  high: 'Hoher Impact',
  medium: 'Mittlerer Impact',
  low: 'Niedriger Impact',
} as const

// ─── Pricing ───────────────────────────────────────────────────────────────

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Einstieg ohne Verpflichtung',
    features: [
      '1 Plattform',
      '1 Profil-Analyse',
      'Relevant Score',
      'Top-3 Hebel',
      '5 personalisierte Hooks',
      '1 Reel-Skript',
      'Freebie-Check (Kurzfassung)',
    ],
    limits: {
      profiles: 1,
      platforms: 1,
      hooksPerMonth: 5,
      scriptsPerMonth: 1,
      contentPlanDays: 0,
      credits: 10,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'Für Creator & kleine Accounts',
    features: [
      'Alles aus Free',
      'Wöchentlicher Relevant Check',
      '30 Hooks / Monat',
      '6 Skripte / Monat',
      '7-Tage Content-Plan',
      'Freebie-Optimierung (Basis)',
    ],
    limits: {
      profiles: 1,
      platforms: 1,
      hooksPerMonth: 30,
      scriptsPerMonth: 6,
      contentPlanDays: 7,
      credits: 50,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    description: 'Für Coaches & ernsthafte Creator',
    features: [
      'Alles aus Starter',
      'Bis zu 3 Plattformen',
      'Wöchentlicher Relevant Score',
      '100 Hooks / Monat',
      '24 Skripte / Monat',
      '14- & 30-Tage Content-Pläne',
      'Plattform-spezifische Hooks',
      'Freebie-Optimierung (vollständig)',
    ],
    limits: {
      profiles: 1,
      platforms: 3,
      hooksPerMonth: 100,
      scriptsPerMonth: 24,
      contentPlanDays: 30,
      credits: 150,
    },
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 199,
    description: 'Für Agenturen & Berater mit Kunden',
    features: [
      'Alles aus Pro',
      '10+ Profile',
      'Alle Plattformen',
      'Teamzugänge',
      'White-Label Reports (PDF)',
      'Priorisierte Agenten-Läufe',
      'Skalierung bis 30 Profile',
    ],
    limits: {
      profiles: 10,
      platforms: 3,
      hooksPerMonth: 500,
      scriptsPerMonth: 100,
      contentPlanDays: 30,
      credits: 500,
    },
  },
]

// ─── Credit Costs ──────────────────────────────────────────────────────────

export const CREDIT_COSTS = {
  profileAnalysis: 10,
  hookPack10: 5,
  scriptPack3: 5,
  contentPlan: 10,
  freebieDeepCheck: 10,
} as const

// ─── Mock Data (für UI-Entwicklung ohne API) ───────────────────────────────

export function generateMockAnalysis() {
  return {
    id: 'mock-analysis-1',
    profileId: 'mock-profile-1',
    relevantScore: 42,
    scores: [
      { category: 'positioning' as ScoreCategory, label: 'Positionierung', score: 6, maxScore: 20 as const },
      { category: 'audience' as ScoreCategory, label: 'Zielgruppe & Angebot', score: 8, maxScore: 20 as const },
      { category: 'hooks' as ScoreCategory, label: 'Hooks', score: 9, maxScore: 20 as const },
      { category: 'scripts' as ScoreCategory, label: 'Content-Struktur', score: 11, maxScore: 20 as const },
      { category: 'freebie' as ScoreCategory, label: 'Freebie & CTA', score: 8, maxScore: 20 as const },
    ],
    diagnosis: 'Dein Profil erklärt, was du machst – aber nicht, warum man dir folgen sollte. Deine Hooks sind sachlich korrekt, bauen aber keine Erwartung auf.',
    levers: [
      {
        id: 'l1',
        title: 'Bio neu strukturieren',
        description: 'Deine Bio beschreibt deine Tätigkeit, nicht den Nutzen für den Leser. Eine klare Aussage über das Ergebnis, das du lieferst, erhöht die Conversion-Rate sofort.',
        priority: 'high' as const,
        category: 'positioning' as ScoreCategory,
      },
      {
        id: 'l2',
        title: 'Freebie klar positionieren',
        description: 'Dein Freebie ist nicht in der Bio sichtbar. Profile ohne klar kommuniziertes Freebie verlieren potenzielle Leads an jeden Touchpoint.',
        priority: 'high' as const,
        category: 'freebie' as ScoreCategory,
      },
      {
        id: 'l3',
        title: 'Hook-Typ wechseln',
        description: 'Deine aktuellen Hooks sind informativ, aber nicht erwartungsaufbauend. Diagnostische Hooks ("Warum dein Content…") performen in deiner Nische besser.',
        priority: 'medium' as const,
        category: 'hooks' as ScoreCategory,
      },
      {
        id: 'l4',
        title: 'Serienformat einføhren',
        description: 'Wiederkehrende Formate erhöhen die Wiedererkennbarkeit und bauen Erwartungshaltung auf. Fehlt bei dir komplett.',
        priority: 'medium' as const,
        category: 'scripts' as ScoreCategory,
      },
      {
        id: 'l5',
        title: 'CTA vereinheitlichen',
        description: 'Jeder Post endet anders. Ein konsistenter CTA, der immer auf dasselbe Ziel verweist, erhöht die Gesamtkonversion.',
        priority: 'low' as const,
        category: 'audience' as ScoreCategory,
      },
    ],
    hooks: [
      {
        id: 'h1',
        text: 'Die meisten Profile scheitern nicht am Algorithmus. Sie scheitern an fehlender Struktur.',
        hookType: 'contrarian' as const,
        platform: 'instagram' as Platform,
        goal: 'Reichweite & Vertrauen',
        ctaLogic: 'Freebie: Profil-Analyse Template',
      },
      {
        id: 'h2',
        text: 'Ich habe 47 Coaches-Profile analysiert. Das war das häufigste Problem.',
        hookType: 'diagnostic' as const,
        platform: 'instagram' as Platform,
        goal: 'Autorität',
        ctaLogic: 'Freebie: Checkliste',
      },
      {
        id: 'h3',
        text: 'Warum dein Content sichtbar ist, aber keine Anfragen erzeugt.',
        hookType: 'diagnostic' as const,
        platform: 'linkedin' as Platform,
        goal: 'Anfragen',
        ctaLogic: 'Freebie: 5-Punkte-Check',
      },
      {
        id: 'h4',
        text: 'Reichweite ohne Relevanz ist Lärm. Das ist der Unterschied.',
        hookType: 'authority' as const,
        platform: 'instagram' as Platform,
        goal: 'Positionierung',
        ctaLogic: 'Freebie: Relevanz-Framework',
      },
      {
        id: 'h5',
        text: 'In 3 Schritten von 12 Anfragen pro Woche auf 0. Das passierte mir.',
        hookType: 'outcome' as const,
        platform: 'tiktok' as Platform,
        goal: 'Engagement',
        ctaLogic: 'Freebie: Fehler-Checkliste',
      },
    ],
    scripts: [
      {
        id: 's1',
        hook: 'Die meisten Profile scheitern nicht am Algorithmus.',
        problem: 'Du postest. Du bist sichtbar. Aber niemand reagiert. Keine Kommentare. Keine Anfragen. Keine Reaktion.',
        insight: 'Das liegt nicht an der Häufigkeit oder dem Format. Es liegt an der Struktur. Relevanz ist kein Gefühl – sie ist ein Systemproblem.',
        cta: 'Hol dir die kostenlose Profil-Analyse im Link in der Bio.',
        platform: 'instagram' as Platform,
        format: 'talking-head' as const,
        durationSec: 30,
      },
    ],
    freebieAnalysis: {
      score: 8,
      hasExistingFreebie: false,
      diagnosis: 'Kein Freebie erkannt. Ohne klar kommunizierten nächsten Schritt verpufft jede Aufmerksamkeit.',
      improvement: {
        title: '5 Gründe, warum dein Content keine Anfragen erzeugt',
        oneLiner: 'Kostenlose Checkliste: Warum dein Profil sichtbar ist, aber nicht konvertiert.',
        bioCopy: 'Hol dir die kostenlose Checkliste → [Link]',
      },
    },
    createdAt: new Date().toISOString(),
  }
}
