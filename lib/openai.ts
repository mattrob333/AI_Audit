import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

/**
 * Returns a singleton OpenAI client instance.
 * Ensure the OPENAI_API_KEY is set in environment variables.
 */
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

/**
 * Generates exactly 10 strategic questions for identifying AI implementation
 * readiness and opportunities. Ensures the response is valid JSON with a "questions" array.
 */
export async function generateQuestions(businessDetails: any, teamDetails: any) {
  // System prompt as an array of strings, then joined for clarity
  const systemPromptParts = [
    'You are an AI implementation consultant helping businesses optimize their operations with AI.',
    'You must respond with valid JSON containing exactly 10 questions about the company\'s processes,',
    'team structure, and technology usage that will help identify the best AI integration opportunities.',
    '',
    'Approach & Style:',
    '• Use first-principles thinking to drill down to root causes, rather than just surface-level issues.',
    '• Apply a theory-of-constraints perspective to identify the biggest bottlenecks and limiting factors.',
    '• Where relevant, leverage a "5 Whys" mindset to uncover deeper reasons behind each challenge.',
    '• Focus on how existing software, team roles, and data flows might integrate with or hinder AI solutions.',
    '',
    'IMPORTANT: Your response must be a valid JSON object with exactly this structure:',
    '{',
    '  "questions": [',
    '    "Question 1",',
    '    "Question 2",',
    '    ...',
    '    "Question 10"',
    '  ]',
    '}',
    '',
    'No additional fields or formatting. Exactly 10 questions in the array.'
  ];
  const systemPrompt = systemPromptParts.join('\n');

  // User prompt as an array of strings, then joined
  const userPromptParts = [
    'Based on the following business and team information, generate strategic questions to understand',
    'their AI implementation readiness, potential bottlenecks, and improvement opportunities.',
    '',
    'Business Context:',
    JSON.stringify(businessDetails, null, 2),
    '',
    'Team Context:',
    JSON.stringify(teamDetails, null, 2),
    '',
    'Remember:',
    '- Use systems thinking (upstream/downstream impacts)',
    '- Identify hidden constraints or repeated challenges',
    '- Tailor questions if certain software or roles are mentioned',
    '- Each question should be concise, yet open-ended for valuable insights',
    '',
    'Respond ONLY with a valid JSON object containing exactly 10 questions.'
  ];
  const userPrompt = userPromptParts.join('\n');

  try {
    const response = await getOpenAIClient().chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gpt-4o',
      temperature: 0.7,
      // Enforcing a JSON response if supported in your library version:
      // Note: Not all versions of the OpenAI library may support this
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // Attempt to parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content.trim());
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI:', parseError);
      console.error('Raw content was:', content);
      throw new Error('Failed to parse JSON from OpenAI response');
    }

    // Validate the JSON structure
    if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response structure: missing questions array');
    }
    if (parsed.questions.length !== 10) {
      throw new Error(`Invalid number of questions: got ${parsed.questions.length}, expected 10`);
    }
    if (!parsed.questions.every((q: any) => typeof q === 'string')) {
      throw new Error('Invalid question format: all questions must be strings');
    }

    return parsed.questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

/**
 * Enhances an existing answer using GPT-4, providing more detailed
 * suggestions and best practices for AI-driven process improvements.
 */
export async function enhanceAnswer(question: string, currentAnswer: string) {
  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `
You are an AI implementation consultant.
Enhance the user's answer with specific suggestions, best practices,
and relevant next steps for AI-driven process improvements.
`
        },
        {
          role: 'user',
          content: `Question: ${question}\nCurrent Answer: ${currentAnswer}\n\nPlease enhance this answer with specific suggestions and best practices.`
        }
      ],
      temperature: 0.7
    });

    const result = response.choices[0].message?.content;
    if (!result) {
      throw new Error('No content returned from OpenAI');
    }

    return result;
  } catch (error) {
    console.error('Error enhancing answer:', error);
    throw error;
  }
}

/**
 * Transcribes audio using the Whisper model. Accepts a Blob of audio
 * and returns the text transcription.
 */
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
