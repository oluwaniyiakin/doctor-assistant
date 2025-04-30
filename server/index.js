// server/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve files from /public

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to handle AI prompt
app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const aiText = response.choices?.[0]?.message?.content?.trim();

    if (!aiText) {
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

    console.log('✅ AI response:', aiText);
    res.json({ response: aiText });

  } catch (error) {
    console.error('❌ OpenAI API error:', error.message || error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

// Fallback route for homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
