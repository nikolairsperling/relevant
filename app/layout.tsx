import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'RELEVANT. — Relevanz ist messbar.',
  description: 'Das Analyse- und Produktionssystem für Relevanz auf Social Media. 5 KI-Agenten analysieren deinen Auftritt und liefern deinen Relevant Score.',
  openGraph: {
    title: 'RELEVANT. — Relevanz ist messbar.',
    description: 'Das Analyse- und Produktionssystem für Relevanz auf Social Media.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${ inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
