import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  console.log('Getting OpenAI client...');
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY environment variable');
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }
  console.log('OpenAI API key found');

  if (!openaiClient) {
    console.log('Initializing new OpenAI client...');
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('OpenAI client initialized');
  } else {
    console.log('Using existing OpenAI client');
  }

  return openaiClient;
}

export async function generateQuestions(businessDetails: any, teamDetails: any) {
  const systemPrompt = `You are an AI implementation consultant helping businesses optimize their operations with AI. You must respond with valid JSON containing exactly 10 questions about the company's processes, team structure, and technology usage that will help identify opportunities for AI integration.

Focus on:
1. Current workflows and bottlenecks
2. Team skills and AI readiness
3. Existing technology infrastructure
4. Data availability and quality
5. Potential AI use cases

Your response must be a valid JSON object with a "questions" array containing exactly 10 strings.`;

  const prompt = `Based on the following information about the business and team, generate strategic questions to understand their AI implementation readiness and opportunities:

Business Context:
${JSON.stringify(businessDetails, null, 2)}

Team Context:
${JSON.stringify(teamDetails, null, 2)}`;

  try {
    const response = await getOpenAIClient().chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "gpt-4",
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const questions = JSON.parse(content).questions;
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Invalid response format from OpenAI');
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function enhanceAnswer(question: string, currentAnswer: string) {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI implementation consultant. Enhance the user's answer with specific suggestions and best practices."
        },
        {
          role: "user",
          content: `Question: ${question}\nCurrent Answer: ${currentAnswer}\n\nPlease enhance this answer with specific suggestions and best practices.`
        }
      ],
      temperature: 0.7
    });

    if (!response.choices[0].message.content) {
      throw new Error('No content returned from OpenAI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error enhancing answer:', error);
    throw error;
  }
}

export async function transcribeAudio(audioBlob: Blob) {
  const audioFile = new File([audioBlob], 'audio.webm', {
    type: 'audio/webm',
  });

  try {
    const response = await getOpenAIClient().audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    return response.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}
