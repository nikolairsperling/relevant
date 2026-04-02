export function ForWho() {
  const audiences = [
    {
      role: 'Creator',
      goal: 'Aufmerksamkeit ohne Zufall.',
      weakness: 'Keine Struktur, kein System, Zufallserfolge.',
      focus: 'Stop-Rate & Share-Potenzial',
    },
    {
      role: 'Coaches',
      goal: 'Autorität statt Austauschbarkeit.',
      weakness: 'Zu weich, zu generisch, kein Proof.',
      focus: 'Autorität & Vertrauen',
    },
    {
      role: 'Dienstleister',
      goal: 'Relevanz, die Anfragen erzeugt.',
      weakness: 'Posten wie Creator, verkaufen aber Services.',
      focus: 'Problemklarheit & Kaufintention',
    },
  ]

  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">Für wen</p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Ein Produkt. Drei Systeme.
          </h2>
          <p className="text-text-secondary text-sm max-w-lg">
            Creator, Coaches und Dienstleister haben unterschiedliche Ziele. Das System unterscheidet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audiences.map((a) => (
            <div
              key={a.role}
              className="border border-border rounded-lg bg-bg-surface p-6 space-y-4"
            >
              <div>
                <p className="text-sm font-semibold">{a.role}</p>
                <p className="text-xs text-text-secondary mt-1">{a.goal}</p>
              </div>
              <div className="space-y-2 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Typisches Problem</p>
                  <p className="text-xs text-text-secondary">{a.weakness}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Hook-Fokus</p>
                  <p className="text-xs text-text-secondary">{a.focus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Positioning */}
        <div className="border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-text-muted uppercase tracking-widest">Was RELEVANT. nicht ist</p>
              <ul className="space-y-1 pt-2">
                {['Post-Generator', '"Viral-Hacks"-Tool', 'Social-Media-Manager'].map((item) => (
                  <li key={item} className="text-sm text-text-muted flex items-center gap-2">
                    <span className="text-xs">—</span>
                    <span className="line-through decoration-text-muted/50">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-muted uppercase tracking-widest">Was RELEVANT. ist</p>
              <ul className="space-y-1 pt-2">
                {['Analyse', 'Priorisierung', 'Klare Handlungsempfehlungen'].map((item) => (
                  <li key={item} className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="text-xs text-white">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-text-secondary">
              Relevanz ist ein Systemproblem. Und genau das lösen wir.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
