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
    businessName: string
    industry: string
    businessUrl: string
    aiSummary: string
    userDescription: string
  }) => void
  onSummaryGenerated?: () => void
  onNext?: () => void
}

export function ProjectForm({ onFormDataChange, onSummaryGenerated, onNext }: ProjectFormProps) {
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
      businessName: '',
      industry: '',
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
    // Validate all required fields
    if (!businessUrl.trim() || generatingSummary) {
      console.error('Missing required fields:', {
        businessUrl: businessUrl.trim()
      });
      setAiSummary('Please fill in all required fields (Company Website or LinkedIn URL) before generating the analysis.');
      return;
    }
    
    setGeneratingSummary(true)
    
    try {
      const response = await fetch(`${FLOWISE_API_URL}${CHATFLOW_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: `Analyze this company URL: ${businessUrl}.`,
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
      onSummaryGenerated?.()
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
        <h2 className="text-lg font-semibold text-white">Let's Start with Your Company</h2>
        <p className="text-sm text-zinc-400">
          Share your company's website or LinkedIn URL. We'll analyze your business context to identify the most impactful AI opportunities.
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Company Website or LinkedIn URL"
            value={businessUrl}
            onChange={(e) => setBusinessUrl(e.target.value)}
          />
          <Button
            onClick={generateSummary}
            disabled={generatingSummary || !businessUrl.trim()}
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

      {aiSummary && (
        <div className="space-y-4 bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-200">AI Analysis</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown 
                className="text-sm text-neutral-200 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-4 [&>ul>li]:mb-1"
              >
                {aiSummary}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Your AI Vision</h2>
        <p className="text-sm text-zinc-400">
          What are your biggest business challenges? Tell us your goals and pain points, and we'll align AI solutions to solve them.
        </p>
        <div className="relative">
          <Textarea
            placeholder="Describe your business challenges and goals..."
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    'absolute bottom-4 right-4 h-6 w-6',
                    isRecording && 'text-red-500'
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? 'Stop recording' : 'Start recording'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
