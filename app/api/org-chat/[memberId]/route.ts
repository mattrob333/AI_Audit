import OpenAI from 'openai'
import { anthropic } from '@ai-sdk/anthropic'
import { OrgMember } from '@/types/org-chart'
import { Message } from 'ai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export const runtime = 'edge'

export async function POST(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { messages, model = 'gpt-4' }: { messages: Message[], model?: string } = await req.json()
    const memberId = params.memberId

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openAI.chat.completions.create({
      model: 'gpt-4',
      messages: messages.filter(message => message.role !== 'data') as ChatCompletionMessageParam[],
      stream: true,
    })

    // Convert the OpenAI stream to a Web API ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return the response with the properly formatted stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
