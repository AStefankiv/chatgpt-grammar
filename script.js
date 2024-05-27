import { config } from "dotenv";
config();
import { OpenAIApi, Configuration } from "openai";
import readline from "readline";


if (!process.env.API_KEY) {
  console.error('API_KEY is required');
  process.exit(1);
}


const configuration = new Configuration({
  apiKey: process.env.API_KEY
});
const openai = new OpenAIApi(configuration);
console.log(process.env.API_KEY)

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

userInterface.prompt();

userInterface.on('line', async (input) => {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }]
    });
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }

  userInterface.prompt();
});