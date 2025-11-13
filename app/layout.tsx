import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Typing Racer - Multiplayer Speed Typing Competition',
  description: 'Race against up to 20 players in a multiplayer typing competition. Test your speed and accuracy with Typing Racer.',
  keywords: 'typing, racer, speed typing, multiplayer, competition',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
