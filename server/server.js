require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 5000;
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI ({ apiKey: process.env.GEMINI_API_KEY});

app.use(express.json());

const pool = require('./config/db.js')

app.get('/', async (req, res) => {
    try {
        const resDb = await pool.query('SELECT * FROM users');
        
        console.log('🚀 Smoke Test Success: Backend linked to PostgreSQL context!');
        console.table(resDb.rows);
        
        res.send("Hello world! Database test passed.");
    } catch (err) {
        console.error('❌ Smoke Test Failure: Backend cannot bridge to PostgreSQL server:', err.message);
        res.status(500).send("Database connection failed.");
    }
});

app.post('/api/chat', async (req, res) => {
  // 1. Destructure expected incoming payload from request body
  const { conversationId, message } = req.body;

  // 2. Validate payload presence (Fail Fast)
  if (!conversationId || !message) {
    return res.status(400).json({ error: 'Missing required parameters: conversationId and message' });
  }

  try {
    // 3. Save User Message into PostgreSQL
    await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [conversationId, 'user', message]
    );

    // 4. Send message to Gemini API with System Persona Instruction
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: 'You are an empathetic, intelligent, and engaging AI companion.',
      }
    });

    const botReply = aiResponse.text;

    // 5. Save AI Response into PostgreSQL and return inserted record
    const dbResult = await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, 'assistant', botReply]
    );

    // 6. Return 200 OK with the saved message object
    res.status(200).json(dbResult.rows[0]);

  } catch (err) {
    console.error('❌ Chat API Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error while generating chat response' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}"`);
});