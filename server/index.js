require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Doctor Assistant API is running ✅");
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main POST route
app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful medical assistant." },
        { role: "user", content: prompt },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ response: reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
