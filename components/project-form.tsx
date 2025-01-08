'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Mic, FileText, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ReactMarkdown from 'react-markdown'

const FLOWISE_API_URL = 'https://flowise-jc8z.onrender.com/api/v1/prediction/'
const CHATFLOW_ID = 'a4604503-0f4c-4047-925c-419ca43664ba'

interface ProjectFormProps {
  formData: {
    businessUrl: string
    aiSummary: string
    userDescription: string
  } | null
  setFormData: (data: {
    businessUrl: string
    aiSummary: string
    userDescription: string
  }) => void
  summaryGenerated: boolean
  setSummaryGenerated: (generated: boolean) => void
  onFormDataChange?: (data: any) => void
  onSummaryGenerated?: () => void
  onNext?: () => void
}

export function ProjectForm({ 
  formData, 
  setFormData, 
  summaryGenerated, 
  setSummaryGenerated,
  onFormDataChange,
  onSummaryGenerated,
  onNext 
}: ProjectFormProps) {
  const [generatingSummary, setGeneratingSummary] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const [transcribing, setTranscribing] = React.useState(false)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const chunksRef = React.useRef<Blob[]>([])

  // Update parent component when form data changes
  React.useEffect(() => {
    if (formData && onFormDataChange) {
      onFormDataChange(formData)
    }
  }, [formData, onFormDataChange])

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
        setTranscribing(true)
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const audioFormData = new FormData()
          audioFormData.append('audio', audioBlob)
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: audioFormData,
          })
          
          if (!response.ok) {
            throw new Error('Failed to transcribe audio')
          }
          
          const { transcription } = await response.json()
          setFormData({
            businessUrl: formData?.businessUrl || '',
            aiSummary: formData?.aiSummary || '',
            userDescription: formData?.userDescription 
              ? `${formData.userDescription}\n${transcription}`
              : transcription,
          })
        } catch (error) {
          console.error('Error transcribing audio:', error)
        } finally {
          setTranscribing(false)
          setIsRecording(false)
          // Clean up the media stream
          stream.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const generateSummary = async () => {
    if (!formData?.businessUrl) return

    setGeneratingSummary(true)
    try {
      const response = await fetch(FLOWISE_API_URL + CHATFLOW_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Analyze this business: ${formData.businessUrl}`,
          history: []
        })
      })

      const data = await response.json()
      setFormData({
        ...formData,
        aiSummary: data.text
      })
      setSummaryGenerated(true)
      onSummaryGenerated?.()
    } catch (err) {
      console.error('Error generating summary:', err)
    } finally {
      setGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-200">Let's Start with Your Company</h2>
        <p className="text-neutral-400">
          Share your company's website or LinkedIn URL. We'll analyze your business context to identify the most impactful AI opportunities.
        </p>
        
        <div className="space-y-4">
          <Input
            placeholder="Company Website or LinkedIn URL"
            value={formData?.businessUrl || ''}
            onChange={(e) => {
              if (formData === null) {
                setFormData({
                  businessUrl: e.target.value,
                  aiSummary: '',
                  userDescription: '',
                })
              } else {
                setFormData({
                  ...formData,
                  businessUrl: e.target.value
                })
              }
            }}
            className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
          />
          
          <Button
            onClick={generateSummary}
            disabled={!formData?.businessUrl || generatingSummary}
            className={cn(
              "w-full",
              summaryGenerated 
                ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            )}
          >
            {generatingSummary ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                {summaryGenerated ? 'Analysis Complete' : 'Generate AI Analysis'}
              </>
            )}
          </Button>
        </div>
      </section>

      {formData?.aiSummary && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-200">AI Analysis</h2>
          <div className="rounded-lg bg-neutral-800/50 border border-neutral-700 p-4">
            <ReactMarkdown className="prose prose-invert max-w-none">
              {formData.aiSummary}
            </ReactMarkdown>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-200">Your AI Vision</h2>
        <p className="text-neutral-400">
          What are your biggest business challenges? Tell us your goals and pain points, and we'll align AI solutions to solve them.
        </p>
        
        <div className="relative">
          <Textarea
            placeholder="Describe your business challenges and goals..."
            value={formData?.userDescription || ''}
            onChange={(e) => {
              if (formData === null) {
                setFormData({
                  businessUrl: '',
                  aiSummary: '',
                  userDescription: e.target.value,
                })
              } else {
                setFormData({
                  ...formData,
                  userDescription: e.target.value
                })
              }
            }}
            className="min-h-[120px] bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "absolute bottom-2 right-2",
                    isRecording && "text-red-500",
                    transcribing && "text-yellow-500"
                  )}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={transcribing}
                >
                  {transcribing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {transcribing 
                    ? 'Transcribing...' 
                    : isRecording 
                      ? 'Stop Recording' 
                      : 'Start Recording'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </div>
  )
}
