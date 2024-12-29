import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export { openai };

export async function generateQuestions(businessDetails: any, teamDetails: any) {
  const prompt = `Based on the business, team, roles, software, value props and services offered by this business, create 10 followup questions to extract more information from the user that would be useful in helping them integrate ai into their business. Format the response as a JSON object with a 'questions' array containing exactly 10 strings.

Business Details:
${JSON.stringify(businessDetails, null, 2)}

Team Details:
${JSON.stringify(teamDetails, null, 2)}

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
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: "You are an AI implementation consultant helping businesses assess their AI readiness. Generate specific, relevant questions based on the provided business context. Always return exactly 10 questions in JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI response content was null');
  }

  try {
    const parsedContent = JSON.parse(content);
    if (!Array.isArray(parsedContent.questions) || parsedContent.questions.length !== 10) {
      throw new Error('Invalid response format from OpenAI');
    }
    return parsedContent.questions;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
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
  // Convert Blob to File object
  const audioFile = new File([audioBlob], 'audio.wav', { 
    type: audioBlob.type,
    lastModified: Date.now()
  });

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  return response.text;
}
