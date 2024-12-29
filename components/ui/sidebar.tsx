"use client"

import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

interface SidebarContextType {
  isExpanded: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: true,
  toggleSidebar: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: 'none' | 'hover' | 'click'
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, collapsible = 'click', ...props }, ref) => {
    const { isExpanded } = useSidebar()
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-screen flex-col border-r bg-background transition-all duration-300",
          collapsible !== 'none' && (isExpanded ? "w-64" : "w-16"),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-b px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto py-2", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center border-t px-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "flex w-full",
      className
    )}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  tooltip?: string
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild, tooltip, children, ...props }, ref) => {
    const { isExpanded } = useSidebar()
    if (asChild) {
      return (
        <div
          className={cn(
            "flex w-full items-center rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            className
          )}
        >
          {children}
        </div>
      )
    }
    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"
