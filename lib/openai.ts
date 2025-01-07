import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export { openai };

export async function generateQuestions(businessDetails: any, teamDetails: any) {
  const systemPrompt = `You are an AI implementation consultant with expertise in business process optimization and AI integration. Your role is to:
1. Analyze the organizational structure and reporting relationships
2. Map how value and information flows through the company
3. Identify potential bottlenecks and inefficiencies
4. Understand team members' AI readiness based on their skills
5. Discover opportunities for AI-powered process optimization

Generate questions that will help uncover:
- How work flows between team members and departments
- Where information or value gets stuck or slowed down
- Which processes could benefit most from AI automation
- How existing AI skills can be leveraged
- What additional AI training might be needed

Always return exactly 10 questions in JSON format.`;

  const prompt = `Based on the following business context, generate strategic questions that will help us understand the company's value flows and identify optimization opportunities.

Business Details:
${JSON.stringify(businessDetails, null, 2)}

Team Details (including reporting structure and AI skills):
${JSON.stringify(teamDetails, null, 2)}

Focus areas for questions:
1. Value Flow Analysis:
   - How does work move between team members?
   - Where are the handoff points?
   - What are the key decision points?

2. Process Bottlenecks:
   - Which processes take the longest?
   - Where do tasks commonly get stuck?
   - What causes delays in delivery?

3. AI Opportunity Mapping:
   - Which processes align with existing AI skills?
   - Where could AI reduce bottlenecks?
   - What new AI capabilities are needed?

Example response format:
{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?",
    ...
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI response content was null');
  }

  try {
    const parsed = JSON.parse(content);
    return parsed.questions;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse OpenAI response');
  }
}

export async function enhanceAnswer(question: string, currentAnswer: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an AI implementation consultant. Enhance the user's answer with specific suggestions and best practices."
      },
      {
        role: "user",
        content: `Question: ${question}\nAnswer: ${currentAnswer}\n\nProvide specific suggestions and best practices based on this answer.`
      }
    ]
  });

  return response.choices[0].message.content || '';
}

export async function transcribeAudio(audioBlob: Blob) {
  // Convert Blob to File object with correct extension for webm
  const audioFile = new File([audioBlob], 'audio.webm', { 
    type: 'audio/webm',
    lastModified: Date.now()
  });

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  return response.text;
}
