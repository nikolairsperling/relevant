import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-bg/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm tracking-widest uppercase">
          RELEVANT<span className="text-text-secondary">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#produkt" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Produkt
          </Link>
          <Link href="#preise" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Preise
          </Link>
          <Link href="/login" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            Anmelden
          </Link>
          <Button variant="primary" size="sm" asChild>
            <Link href="/onboarding">Profil analysieren</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Button variant="primary" size="sm" asChild>
            <Link href="/onboarding">Analysieren</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
