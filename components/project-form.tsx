'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2, Mic, FileText, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ReactMarkdown from 'react-markdown'
import { BusinessDetails } from '@/lib/types'

const FLOWISE_API_URL = 'https://flowise-jc8z.onrender.com/api/v1/prediction/'
const CHATFLOW_ID = 'a4604503-0f4c-4047-925c-419ca43664ba'

interface ProjectFormProps {
  formData: BusinessDetails | null
  setFormData: (data: BusinessDetails) => void
  summaryGenerated: boolean
  setSummaryGenerated: (generated: boolean) => void
  onFormDataChange?: (data: BusinessDetails) => void
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
            userDescription: formData?.userDescription 
              ? `${formData.userDescription}\n${transcription}`
              : transcription,
            businessUrl: formData?.businessUrl || '',
            aiSummary: formData?.aiSummary || ''
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
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-neutral-200">Let's Start with Your Company</h2>
        <p className="text-neutral-400">
          Provide your company details, market context, and objectives so we can personalize your AI journey
        </p>
        <div className="mt-4 space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <h3 className="font-medium text-neutral-300">What We'll Need:</h3>
          <ul className="list-disc list-inside space-y-2 text-neutral-400">
            <li>Your website or LinkedIn profile (for basic company data)</li>
            <li>A clear statement of your business goals and bottlenecks</li>
          </ul>
          <h3 className="font-medium text-neutral-300 pt-2">Why It Matters:</h3>
          <ul className="list-disc list-inside space-y-2 text-neutral-400">
            <li>By understanding your business model and the value you deliver, we'll uncover unique AI opportunities</li>
            <li>Sharing challenges or hurdles helps us align AI solutions with real needs</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="businessUrl" className="block text-sm font-medium text-neutral-200">
            Company Website or LinkedIn URL
          </label>
          <Input
            id="businessUrl"
            placeholder="https://..."
            value={formData?.businessUrl || ''}
            onChange={(e) => setFormData({ ...formData as BusinessDetails, businessUrl: e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
          />
        </div>

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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-200">
            Describe Your Value Chain
          </label>
          <p className="text-sm text-neutral-400">
            Share your key inputs (leads, raw materials, etc.), how they're processed, and what outputs you deliver to your customers.
            Where do you see the biggest slowdowns or roadblocks in your current workflow?
          </p>
          <div className="relative">
            <Textarea
              placeholder="Describe your business challenges and goals..."
              value={formData?.userDescription || ''}
              onChange={(e) => setFormData({ ...formData as BusinessDetails, userDescription: e.target.value })}
              className="min-h-[120px] bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <span className="text-sm text-neutral-400">Voice Input</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
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
          </div>
        </div>
      </div>

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
    </div>
  )
}
