// import express from 'express';
// import { config } from 'dotenv';
// import { OpenAIApi, Configuration } from 'openai';
// import path from 'path';
// import { fileURLToPath } from 'url';

// config();

// if (!process.env.API_KEY) {
//   console.error('API_KEY is required');
//   process.exit(1);
// }

// const app = express();
// const PORT = process.env.PORT || 3001;

// const configuration = new Configuration({
//   apiKey: process.env.API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// // Middleware to parse JSON bodies
// app.use(express.json());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, '..', 'frontend')));

// // API endpoint to handle chat messages
// app.post('/api/chat', async (req, res) => {
//   const { message } = req.body;

//   try {
//     const response = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         { role: 'system',
//         content: `You are an assistant that corrects grammatical mistakes in the user's text. Respond **exactly** in the following format:

// Corrected Sentence: <corrected sentence>
// Explanation: <brief explanation of the corrections you made>

// Do not include any additional text or deviation from the format.`
//       },
//       {
//         role: 'user',
//         content: message,
//       }
//     ],
//   });

//     res.json({ reply: response.data.choices[0].message.content });
//   } catch (error) {
//     console.error('Error communicating with OpenAI:',
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({
//       error: 'Failed to communicate with OpenAI',
//       details: error.response ? error.response.data : error.message
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
