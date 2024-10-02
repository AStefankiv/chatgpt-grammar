// netlify/functions/chat.js
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

  // Parse the incoming request body
  const { message } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that corrects grammatical mistakes in the user's text. Respond **exactly** in the following format:

Corrected Sentence: <corrected sentence>
Explanation: <brief explanation of the corrections you made>

Do not include any additional text or deviation from the format.`,
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