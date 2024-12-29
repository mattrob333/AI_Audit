'use client'

import * as React from 'react'
import { Mic, Sparkles, Square } from 'lucide-react'
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

  const [recording, setRecording] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);

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
    const question = questionsState.find(q => q.id === id);
    if (!question?.answer) return;

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.text,
          answer: question.answer
        }),
      });

      const data = await response.json();
      if (data.enhancedAnswer) {
        handleAnswerChange(id, data.enhancedAnswer);
      }
    } catch (error) {
      console.error('Error enhancing answer:', error);
    }
  };

  const startRecording = async (id: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          if (data.transcription) {
            handleAnswerChange(id, data.transcription);
          }
        } catch (error) {
          console.error('Error transcribing audio:', error);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const isComplete = questionsState.every(q => q.answer || q.isSkipped)

  return (
    <div className="space-y-8 -ml-10">
      <Alert variant="default" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
        <AlertDescription>
          All questions must be answered before proceeding
        </AlertDescription>
      </Alert>

      {questionsState.map((question) => (
        <div key={question.id} className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium mb-2">
                {question.id}. {question.text}
              </h3>
              <div className="relative">
                <Textarea
                  placeholder="Type your answer here..."
                  value={question.answer}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="min-h-[100px] resize-y"
                  disabled={question.isSkipped}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute bottom-2 right-2 ${recording ? 'text-red-500' : ''}`}
                  onClick={() => recording ? stopRecording() : startRecording(question.id)}
                >
                  {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span className="sr-only">{recording ? 'Stop recording' : 'Start recording'}</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSkip(question.id)}
                disabled={question.isSkipped}
              >
                Skip
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleAIAnswer(question.id)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Answer
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Let AI suggest an answer based on your previous inputs
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Button
          onClick={() => onSubmit(questionsState)}
          disabled={!isComplete}
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}
