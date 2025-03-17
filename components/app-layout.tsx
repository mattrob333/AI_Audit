'use client'

import { Sidebar } from "@/components/sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
