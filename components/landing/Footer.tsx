import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-widest uppercase">
            RELEVANT<span className="text-text-secondary">.</span>
          </p>
          <p className="text-xs text-text-muted">Relevanz ist messbar.</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            { label: 'Impressum', href: '/impressum' },
            { label: 'Datenschutz', href: '/datenschutz' },
            { label: 'AGB', href: '/agb' },
            { label: 'Anmelden', href: '/login' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
