'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  HomeIcon, 
  FolderIcon, 
  UsersIcon, 
  FileTextIcon,
  BuildingIcon 
} from 'lucide-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Home",
      icon: HomeIcon,
      href: "/"
    },
    {
      title: "Projects",
      icon: FolderIcon,
      href: "/projects"
    },
    {
      title: "Team",
      icon: UsersIcon,
      href: "/team"
    },
    {
      title: "Documents",
      icon: FileTextIcon,
      href: "/documents"
    },
    {
      title: "Company",
      icon: BuildingIcon,
      href: "/company"
    }
  ]

  return (
    <div className={cn("flex flex-col bg-black border-r border-neutral-800", className)} {...props}>
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-900">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-400"
          >
            <path
              d="M4 20L10 14L14 18L20 4"
            />
          </svg>
        </div>
        <span className="font-semibold text-neutral-200">nextmethod.ai</span>
      </div>
      <nav className="flex flex-col space-y-1 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
                "transition-colors duration-200",
                "hover:bg-emerald-500/10 hover:text-emerald-500",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : "text-neutral-400"
              )}
            >
              <item.icon className={cn(
                "mr-2 h-4 w-4",
                isActive ? "text-emerald-500" : "text-neutral-400"
              )} />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
