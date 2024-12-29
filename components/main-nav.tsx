'use client'

import { Home, FolderKanban, Users, BookOpen, Building2, Settings, Mountain } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Projects', href: '#', icon: FolderKanban },
  { name: 'Team', href: '#', icon: Users },
  { name: 'Documentation', href: '#', icon: BookOpen },
  { name: 'Company', href: '#', icon: Building2 },
]

export function MainNav() {
  return (
    <Sidebar 
      collapsible="none" 
      className="border-r border-border/40 w-[220px] sticky top-0 h-screen"
    >
      <SidebarHeader className="h-14 px-4 flex items-center border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/20 p-1">
            <Mountain className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold">nextmethod.ai</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href={item.href} className="flex items-center gap-3 px-4 py-2">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <a href="#">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
