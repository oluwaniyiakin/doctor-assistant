// server/index.js

const express = require('express');
const bodyParser = require('body-parser');
const { OpenAIApi, Configuration } = require('openai');
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

// Instantiating the OpenAI API Client
const openai = new OpenAIApi(configuration);

// POST /ask endpoint to handle user requests
app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",  // Or the appropriate model you're using
      prompt: prompt,
      max_tokens: 150,
    });

    const aiResponse = completion.data.choices[0].text.trim();
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
