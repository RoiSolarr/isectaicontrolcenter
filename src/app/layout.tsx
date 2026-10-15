import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'iSectAI Control Center', template: '%s · iSectAI Control Center' },
  description: 'Internal administrator console for the iSectAI platform.',
  // Internal tool: keep it out of search engines.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0e1d34',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
