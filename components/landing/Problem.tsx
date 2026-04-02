export function Problem() {
  const symptoms = [
    'Views sind da, Kommentare fehlen',
    'Likes, aber keine Anfragen',
    'Follower wachsen, Umsatz nicht',
    'Content fühlt sich richtig an, wirkt aber nicht',
  ]

  return (
    <section className="py-24 px-6 border-t border-border" id="produkt">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* Problem Statement */}
        <div className="space-y-6">
          <p className="text-xs text-text-muted uppercase tracking-widest">Das Problem</p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Das Problem ist selten der Algorithmus.
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-xl">
            Die meisten Creator, Coaches und Dienstleister posten regelmäßig.
            Sie sind sichtbar. Aber sie erzeugen keine Reaktion.
          </p>
          <p className="text-text-secondary leading-relaxed max-w-xl">
            Nicht, weil der Content schlecht ist. Sondern weil er strukturell
            irrelevant ist.
          </p>
        </div>

        {/* Symptoms */}
        <div className="space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">Kommt dir das bekannt vor?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {symptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-start gap-3 border border-border rounded-md p-4 bg-bg-surface"
              >
                <span className="mt-0.5 text-text-muted">—</span>
                <span className="text-sm text-text-secondary">{symptom}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary pt-2">
            RELEVANT. misst genau das.
          </p>
        </div>

        {/* Existing Solutions */}
        <div className="space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">Warum bestehende Tools nicht reichen</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Content-Generatoren',
                problem: 'Produzieren mehr Output. Keine Diagnose.',
              },
              {
                name: 'Analytics-Tools',
                problem: 'Zeigen Zahlen. Keine Handlungsempfehlung.',
              },
              {
                name: 'Viral-Hacks',
                problem: 'Behandeln Symptome. Nicht die Ursache.',
              },
            ].map((tool) => (
              <div key={tool.name} className="border border-border rounded-md p-4 bg-bg-surface space-y-2">
                <p className="text-sm font-medium text-text-secondary line-through decoration-text-muted">
                  {tool.name}
                </p>
                <p className="text-xs text-text-muted">{tool.problem}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary pt-1">
            Niemand diagnostiziert die Ursache.
          </p>
        </div>
      </div>
    </section>
  )
}
