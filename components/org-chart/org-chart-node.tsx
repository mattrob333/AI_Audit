'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Settings2 } from 'lucide-react'
import { OrgMember } from "@/types/org-chart"
import { cn } from "@/lib/utils"

interface OrgChartNodeProps {
  member: OrgMember
  onChatClick: (memberId: string) => void
  onSettingsClick: (memberId: string) => void
  className?: string
}

export function OrgChartNode({ member, onChatClick, onSettingsClick, className }: OrgChartNodeProps) {
  return (
    <div 
      className={cn(
        "relative w-[280px] bg-zinc-900/90 rounded-lg overflow-hidden border border-zinc-800/50 transition-all duration-200 hover:border-zinc-700/50",
        className
      )}
    >
      <div className="p-4 border-l-2 border-emerald-500/70">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-zinc-100 truncate">{member.name}</h3>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-0">
              {member.department}
            </Badge>
            <p className="text-sm text-zinc-400 mt-1 truncate">{member.role}</p>
          </div>
          <Avatar className="h-10 w-10 border border-zinc-800 shrink-0">
            <AvatarImage src={member.imageUrl} alt={member.name} />
            <AvatarFallback className="bg-zinc-800 text-zinc-300">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-0 transition-colors"
            onClick={() => onChatClick(member.id)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className="flex-1 bg-zinc-800/50 hover:bg-zinc-800 border-0 transition-colors"
            onClick={() => onSettingsClick(member.id)}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
