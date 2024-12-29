import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { MainNav } from '@/components/main-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Integration Audit',
  description: 'Start your AI integration journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <div className="relative flex min-h-screen">
          <div className="fixed inset-y-0 z-50">
            <MainNav />
          </div>
          <main className="flex-1 ml-[250px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
