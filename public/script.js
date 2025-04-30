const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(express.static('public'));  // Serve static files from the 'public' folder

// OpenAI API Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Your OpenAI API Key
});

const openai = new OpenAIApi(configuration);

// POST /ask endpoint to handle user requests
app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  // Basic input validation
  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    // Send the prompt to OpenAI API to get a response
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",  // Model to use, can be gpt-4 if available
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract the response from OpenAI
    const aiResponse = completion.data.choices[0].message.content;

    // Send the AI response back to the frontend
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Error from OpenAI API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request. Please try again later.' });
  }
});

// Root route to serve the index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
