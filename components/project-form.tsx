'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ReactMarkdown from 'react-markdown'

const FLOWISE_API_URL = 'https://flowise-jc8z.onrender.com/api/v1/prediction/'
const CHATFLOW_ID = 'a4604503-0f4c-4047-925c-419ca43664ba'

interface ProjectFormProps {
  onFormDataChange?: (data: {
    businessUrl: string
    aiSummary: string
    userDescription: string
  }) => void
}

export function ProjectForm({ onFormDataChange }: ProjectFormProps) {
  const [businessUrl, setBusinessUrl] = React.useState('')
  const [generatingSummary, setGeneratingSummary] = React.useState(false)
  const [aiSummary, setAiSummary] = React.useState('')
  const [isRecording, setIsRecording] = React.useState(false)
  const [userDescription, setUserDescription] = React.useState('')
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])

  // Update parent component when form data changes
  React.useEffect(() => {
    onFormDataChange?.({
      businessUrl,
      aiSummary,
      userDescription
    })
  }, [businessUrl, aiSummary, userDescription, onFormDataChange])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        try {
          const formData = new FormData()
          formData.append('audio', audioBlob)
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })
          
          if (!response.ok) {
            throw new Error('Failed to transcribe audio')
          }
          
          const { transcription } = await response.json()
          setUserDescription(prev => prev + (prev ? '\n' : '') + transcription)
        } catch (error) {
          console.error('Error processing audio:', error)
          setUserDescription(prev => prev + (prev ? '\n' : '') + '[Error transcribing audio]')
        } finally {
          chunksRef.current = []
          // Cleanup the media stream
          stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const generateSummary = async () => {
    if (!businessUrl.trim() || generatingSummary) return
    setGeneratingSummary(true)
    
    try {
      const response = await fetch(`${FLOWISE_API_URL}${CHATFLOW_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: `Analyze this company URL: ${businessUrl}`,
          history: []
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI analysis')
      }

      const data = await response.json()
      // Clean and process the response text
      const formattedText = data.text
        ?.replace(/```markdown/g, '') // Remove markdown code block markers
        ?.replace(/```/g, '') // Remove remaining code block markers
        ?.replace(/^#+\s+/gm, '') // Remove markdown headers
        ?.replace(/\*\*/g, '') // Remove bold markers
        ?.replace(/^\s*[-•]\s*/gm, '• ') // Standardize bullet points
        ?.replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines to maximum of 2
        ?.trim() || 'Unable to generate analysis. Please try again.'
      setAiSummary(formattedText)
    } catch (error) {
      console.error('Error generating summary:', error)
      setAiSummary('Error generating analysis. Please try again.')
    } finally {
      setGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-200">
            Let's Start with Your Company
          </h2>
          <p className="text-base text-neutral-400">
            Share your company's website or LinkedIn URL. We'll analyze your business 
            context to identify the most impactful AI opportunities.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://www.linkedin.com/company/your-company"
            value={businessUrl}
            onChange={(e) => setBusinessUrl(e.target.value)}
            className="flex-1 bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
          />
          <Button
            onClick={generateSummary}
            disabled={generatingSummary || !businessUrl.trim()}
            className="px-6 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-medium"
          >
            {generatingSummary ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {aiSummary && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-neutral-50">Business Overview</h2>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="text-neutral-300 space-y-4">
                {aiSummary.split('\n\n').map((paragraph, i) => (
                  <div key={i} className="space-y-2">
                    {paragraph.split('\n').map((line, j) => {
                      // Skip empty lines
                      if (!line.trim()) return null;
                      
                      // Check if this is a section header
                      if (line.match(/^[A-Z][A-Za-z\s]+:?$/)) {
                        return (
                          <h3 key={j} className="text-neutral-50 font-medium mt-4 mb-2">
                            {line}
                          </h3>
                        );
                      }
                      
                      // Regular line or bullet point
                      return (
                        <p key={j} className="text-neutral-300 leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-200">
            Your AI Vision
          </h2>
          <p className="text-base text-neutral-400">
            What are your biggest business challenges? Tell us your goals and pain points, 
            and we'll align AI solutions to solve them. Use voice or text to share your thoughts.
          </p>
        </div>

        <div className="relative">
          <Textarea
            value={userDescription}
            onChange={e => setUserDescription(e.target.value)}
            placeholder="Share your thoughts on how AI could help your business..."
            className="min-h-[200px] resize-y pr-20 bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={isRecording ? stopRecording : startRecording}
                    className="bg-neutral-950 border-neutral-800 hover:bg-emerald-500/10 hover:text-emerald-500"
                  >
                    <Mic className={cn("h-4 w-4", isRecording && "text-emerald-500")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Stop recording" : "Start recording"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
