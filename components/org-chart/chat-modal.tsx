'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useChat } from "ai/react"
import { OrgMember } from "@/types/org-chart"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2 } from 'lucide-react'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  member: OrgMember
}

export function ChatModal({ isOpen, onClose, member }: ChatModalProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/org-chat/${member.id}`,
    id: member.id,
    initialMessages: [{
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm ${member.name}, ${member.role}. How can I help you today?`
    }]
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col bg-neutral-950 border-neutral-800">
        <DialogHeader className="border-b border-neutral-800 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-neutral-800">
              <AvatarFallback className="bg-neutral-900 text-neutral-200">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-neutral-200">{member.name}</span>
              <span className="text-xs text-neutral-500">{member.role}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-emerald-950 text-emerald-400'
                      : 'bg-neutral-900 text-neutral-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-neutral-900">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-neutral-800">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="bg-neutral-900 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700 text-neutral-100"
            disabled={isLoading}
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
