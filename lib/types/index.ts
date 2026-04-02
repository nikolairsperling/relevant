// ─── Platform & Role ───────────────────────────────────────────────────────

export type Platform = 'instagram' | 'tiktok' | 'linkedin'
export type Role = 'creator' | 'coach' | 'dienstleister'
export type Goal = 'follower' | 'engagement' | 'kommentare' | 'anfragen' | 'umsatz'
export type Plan = 'free' | 'starter' | 'pro' | 'agency'

// ─── Onboarding ────────────────────────────────────────────────────────────

export interface OnboardingData {
  platforms: Platform[]
  role: Role | null
  goals: Goal[]
  profileUrl: string
  bioText: string
  hasFreebie: boolean
  freebieText: string
}

// ─── Score & Analysis ──────────────────────────────────────────────────────

export type ScoreCategory =
  | 'positioning'
  | 'audience'
  | 'hooks'
  | 'scripts'
  | 'freebie'

export interface CategoryScore {
  category: ScoreCategory
  label: string
  score: number // 0-20
  maxScore: 20
}

export interface Lever {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: ScoreCategory
}

export interface Hook {
  id: string
  text: string
  hookType: 'contrarian' | 'diagnostic' | 'authority' | 'outcome'
  platform: Platform
  goal: string
  ctaLogic: string
}

export interface Script {
  id: string
  hook: string
  problem: string
  insight: string
  cta: string
  platform: Platform
  format: 'talking-head' | 'b-roll' | 'screen-recording' | 'text-on-screen'
  durationSec: number
}

export interface FreebieAnalysis {
  score: number // 0-20
  hasExistingFreebie: boolean
  diagnosis: string
  improvement: {
    title: string
    oneLiner: string
    bioCopy: string
  } | null
}

export interface AnalysisResult {
  id: string
  profileId: string
  relevantScore: number // 0-100
  scores: CategoryScore[]
  diagnosis: string // "Warum du ignoriert wirst"
  levers: Lever[]
  hooks: Hook[]
  scripts: Script[]
  freebieAnalysis: FreebieAnalysis
  createdAt: string
}

// ─── Database Models ───────────────────────────────────────────────────────

export interface Profile {
  id: string
  workspaceId: string
  platform: Platform
  role: Role
  goals: Goal[]
  profileUrl: string
  bioText: string
  hasFreebie: boolean
  freebieText: string
  createdAt: string
}

export interface Workspace {
  id: string
  name: string
  plan: Plan
  ownerId: string
  createdAt: string
}

export interface Credits {
  workspaceId: string
  balance: number
  updatedAt: string
}

// ─── UI State ──────────────────────────────────────────────────────────────

export interface OnboardingStep {
  id: number
  label: string
  completed: boolean
}

export type AnalysisStatus = 'idle' | 'running' | 'completed' | 'failed'

// ─── Agent Types ───────────────────────────────────────────────────────────

export interface AgentInput {
  platform: Platform
  role: Role
  goals: Goal[]
  profileUrl?: string
  bioText?: string
  freebieText?: string
  hasFreebie: boolean
}

export interface AgentOutput {
  agentName: string
  score: number
  diagnosis: string
  improvements: string[]
  rawOutput: Record<string, unknown>
}

// ─── Pricing ───────────────────────────────────────────────────────────────

export interface PricingTier {
  id: Plan
  name: string
  price: number | null
  description: string
  features: string[]
  limits: {
    profiles: number
    platforms: number
    hooksPerMonth: number
    scriptsPerMonth: number
    contentPlanDays: number
    credits: number
  }
}
