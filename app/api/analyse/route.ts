import { NextResponse } from 'next/server'
import type { OnboardingData } from '@/lib/types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: Request) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key nicht konfiguriert' },
      { status: 500 }
    )
  }

  let data: OnboardingData
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
  }

  const platform = data.platforms[0] ?? 'instagram'

  const systemPrompt = `Du bist RELEVANT., ein KI-Analyst für Social-Media-Positionierung.
Deine Aufgabe ist es, Social-Media-Profile zu analysieren und einen "Relevant Score" zu berechnen.

Bewerte folgende 5 Kategorien jeweils mit 0-20 Punkten:
1. positioning (Positionierung): Klarheit der Nische, Claim, Alleinstellung
2. audience (Zielgruppe & Angebot): Zielgruppenklarheit, Kaufmotive, Einwände
3. hooks (Hooks): Hook-Qualität, Varianz, Plattform-Eignung
4. scripts (Content-Struktur): Struktur, Problemformulierung, Handlungsanleitung
5. freebie (Freebie & CTA): Freebie-Klarheit, CTA-Stärke, Conversion-Logik

Antworte NUR mit validem JSON – kein Markdown, keine Erklärungen außerhalb.`

  const userMessage = `Analysiere dieses Social-Media-Profil und antworte mit JSON:

Plattform(en): ${data.platforms.join(', ')}
Rolle: ${data.role}
Ziele: ${data.goals.join(', ')}
${data.profileUrl ? `Profil-URL: ${data.profileUrl}` : 'Profil-URL: nicht angegeben'}
${data.bioText ? `Bio/Headline: "${data.bioText}"` : 'Bio: nicht angegeben'}
${data.hasFreebie ? `Freebie: "${data.freebieText || 'vorhanden, aber nicht beschrieben'}"` : 'Freebie: keins'}

Gib eine ehrliche, direkte Analyse auf Deutsch. Sei spezifisch.

Antworte mit diesem JSON-Format:
{
  "relevantScore": <Summe der 5 Kategorie-Scores, 0-100>,
  "scores": [
    {"category": "positioning", "label": "Positionierung", "score": <0-20>, "maxScore": 20},
    {"category": "audience", "label": "Zielgruppe & Angebot", "score": <0-20>, "maxScore": 20},
    {"category": "hooks", "label": "Hooks", "score": <0-20>, "maxScore": 20},
    {"category": "scripts", "label": "Content-Struktur", "score": <0-20>, "maxScore": 20},
    {"category": "freebie", "label": "Freebie & CTA", "score": <0-20>, "maxScore": 20}
  ],
  "diagnosis": "<1-2 prägnante Sätze: Warum wird dieses Profil gerade ignoriert?>",
  "levers": [
    {"id": "l1", "title": "<konkreter Hebel>", "description": "<Was genau ändern, warum>", "priority": "high", "category": "<positioning|audience|hooks|scripts|freebie>"},
    {"id": "l2", "title": "<konkreter Hebel>", "description": "<Was genau ändern, warum>", "priority": "medium", "category": "<kategorie>"},
    {"id": "l3", "title": "<konkreter Hebel>", "description": "<Was genau ändern, warum>", "priority": "low", "category": "<kategorie>"}
  ],
  "hooks": [
    {"id": "h1", "text": "<konkreter Hook-Text>", "hookType": "contrarian", "platform": "${platform}", "goal": "<Ziel>", "ctaLogic": "<CTA-Logik>"},
    {"id": "h2", "text": "<konkreter Hook-Text>", "hookType": "diagnostic", "platform": "${platform}", "goal": "<Ziel>", "ctaLogic": "<CTA-Logik>"},
    {"id": "h3", "text": "<konkreter Hook-Text>", "hookType": "authority", "platform": "${platform}", "goal": "<Ziel>", "ctaLogic": "<CTA-Logik>"},
    {"id": "h4", "text": "<konkreter Hook-Text>", "hookType": "outcome", "platform": "${platform}", "goal": "<Ziel>", "ctaLogic": "<CTA-Logik>"},
    {"id": "h5", "text": "<konkreter Hook-Text>", "hookType": "contrarian", "platform": "${platform}", "goal": "<Ziel>", "ctaLogic": "<CTA-Logik>"}
  ],
  "scripts": [
    {
      "id": "s1",
      "hook": "<Eröffnungszeile des Videos>",
      "problem": "<Das Problem in 1-2 Sätzen>",
      "insight": "<Die Einsicht oder Lösung>",
      "cta": "<Der Call to Action>",
      "platform": "${platform}",
      "format": "talking-head",
      "durationSec": 45
    }
  ],
  "freebieAnalysis": {
    "score": <0-20>,
    "hasExistingFreebie": ${data.hasFreebie},
    "diagnosis": "<Diagnose: Was fehlt oder was funktioniert>",
    "improvement": ${data.hasFreebie
      ? '{"title": "<verbesserter Freebie-Titel>", "oneLiner": "<ein prägnanter Satz>", "bioCopy": "<Bio-Text mit Freebie-CTA>"}'
      : 'null'}
  }
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI error:', errorData)
      return NextResponse.json(
        { error: errorData?.error?.message ?? 'OpenAI-Fehler' },
        { status: 500 }
      )
    }

    const completion = await response.json()
    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Leere Antwort von OpenAI' }, { status: 500 })
    }

    const analysis = JSON.parse(content)

    const result = {
      id: `analysis-${Date.now()}`,
      profileId: 'user-profile',
      createdAt: new Date().toISOString(),
      ...analysis,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analyse-Fehler:', error)
    return NextResponse.json(
      { error: 'Analyse fehlgeschlagen. Bitte versuche es erneut.' },
      { status: 500 }
    )
  }
}
