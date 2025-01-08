'use client'

import * as React from 'react'
import { Mic, Sparkles, Square, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Question = {
  id: number
  text: string
  answer: string
  isSkipped: boolean
}

export function QuestionForm({
  questions = [],
  onSubmit
}: {
  questions?: Question[]
  onSubmit: (questions: Question[]) => void
}) {
  const [questionsState, setQuestions] = React.useState<Question[]>(questions)
  const [recording, setRecording] = React.useState(false)
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([])

  const handleAnswerChange = (id: number, answer: string) => {
    setQuestions(questionsState.map(q =>
      q.id === id ? { ...q, answer, isSkipped: false } : q
    ))
  }

  const handleSkip = (id: number) => {
    setQuestions(questionsState.map(q =>
      q.id === id ? { ...q, isSkipped: true } : q
    ))
  }

  const handleAIAnswer = async (id: number) => {
    const question = questionsState.find(q => q.id === id)
    if (!question?.answer) return

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.text,
          answer: question.answer
        }),
      })

      const data = await response.json()
      if (data.enhancedAnswer) {
        handleAnswerChange(id, data.enhancedAnswer)
      }
    } catch (error) {
      console.error('Error enhancing answer:', error)
    }
  }

  const startRecording = async (id: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setAudioChunks([])
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data])
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const formData = new FormData()
        formData.append('audio', audioBlob)

        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          })

          const data = await response.json()
          if (data.transcription) {
            handleAnswerChange(id, data.transcription)
          }
        } catch (error) {
          console.error('Error transcribing audio:', error)
        }
      }

      recorder.start()
      setMediaRecorder(recorder)
      setRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = (id: number) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setRecording(false)
      setMediaRecorder(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(questionsState)
  }

  const allQuestionsAnswered = questionsState.every(q => q.answer || q.isSkipped)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm p-8 space-y-8">
        <div className="border border-yellow-600/20 bg-yellow-500/10 rounded-lg p-4">
          <p className="text-sm text-yellow-200/80">
            All questions must be answered before proceeding
          </p>
        </div>

        {questionsState.map((question) => (
          <div key={question.id} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <label
                htmlFor={`question-${question.id}`}
                className="text-base font-medium text-neutral-200"
              >
                {question.id}. {question.text}
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSkip(question.id)}
                className="shrink-0 text-neutral-400 hover:text-neutral-300"
              >
                Skip
              </Button>
            </div>

            <div className="relative">
              <Textarea
                id={`question-${question.id}`}
                value={question.answer}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[100px] bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 resize-none"
                disabled={question.isSkipped}
              />
              
              <div className="absolute right-3 bottom-3 flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAIAnswer(question.id)}
                      className="text-neutral-400 hover:text-neutral-300"
                      disabled={!question.answer || question.isSkipped}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enhance with AI</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => recording ? stopRecording(question.id) : startRecording(question.id)}
                      className={recording ? "text-red-400 hover:text-red-300" : "text-neutral-400 hover:text-neutral-300"}
                      disabled={question.isSkipped}
                    >
                      {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {recording ? "Stop Recording" : "Start Recording"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {question.isSkipped && (
              <Alert variant="default" className="bg-neutral-800/50 border-neutral-700">
                <AlertDescription>
                  This question has been skipped. Click "Skip" again to unskip.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}

        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <Button
            type="submit"
            disabled={!allQuestionsAnswered}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium disabled:opacity-50"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
