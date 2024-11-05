import { Configuration, OpenAIApi } from 'openai';

export async function handler(event, context) {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error('API_KEY is required');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API_KEY is not configured' }),
    };
  }

  const { message, language } = JSON.parse(event.body); // Receive language parameter here
  console.log('Received message:', message);
  console.log('Selected language:', language);

  const configuration = new Configuration({
    apiKey: API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const languageInstructions = {
    'en-US': 'correct grammatical mistakes in English',
    'uk-UA': 'correct grammatical mistakes in Ukrainian',
    'fr-FR': 'correct grammatical mistakes in French',
    'es-ES': 'correct grammatical mistakes in Spanish',
  };

  const languageInstruction = languageInstructions[language] || languageInstructions['en-US'];

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that ${languageInstruction} in the user's text and explains the mistakes. Respond **exactly** in the following format:
                    Corrected Sentence: <corrected sentence>
                    Explanation: <extended explanation of the corrections you made>
                    Do not include any additional text or deviation from the format. Respond in the same language as the user's input.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.data.choices[0].message.content }),
    };
  } catch (error) {
    console.error(
      'Error communicating with OpenAI:',
      error.response ? error.response.data : error.message
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to communicate with OpenAI',
        details: error.response ? error.response.data : error.message,
      }),
    };
  }
}
