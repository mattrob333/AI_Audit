import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { businessDetails, teamDetails, auditAnswers } = await req.json()

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [{
      role: "system",
      content: `You are an AI integration expert. Analyze the following business information and create a comprehensive overview and integration plan. Focus on identifying key strengths, weaknesses, and opportunities for AI integration.

Business Details:
${JSON.stringify(businessDetails, null, 2)}

Team & Software Details:
${JSON.stringify(teamDetails, null, 2)}

Audit Answers:
${JSON.stringify(auditAnswers, null, 2)}

Generate a detailed analysis in JSON format with the following structure:
{
  "businessOverview": "A clear, concise summary of the business",
  "keyChallenges": ["Challenge 1", "Challenge 2", ...],
  "strengths": ["Strength 1", "Strength 2", ...],
  "integrationOpportunities": ["Opportunity 1", "Opportunity 2", ...],
  "implementationConsiderations": ["Consideration 1", "Consideration 2", ...],
  "timeline": {
    "phase1": "Description of phase 1",
    "phase2": "Description of phase 2",
    "phase3": "Description of phase 3"
  },
  "trainingNeeds": ["Training need 1", "Training need 2", ...],
  "complianceAndSecurity": ["Consideration 1", "Consideration 2", ...]
}`
    }]

    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }
    const parsedContent = JSON.parse(content)

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error('Error generating overview:', error)
    return NextResponse.json(
      { error: 'Failed to generate business overview. Please try again.' },
      { status: 500 }
    )
  }
}
