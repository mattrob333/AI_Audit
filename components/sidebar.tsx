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
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-bold tracking-tight text-emerald-500">nextmethod.ai</span>
        </Link>
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
