require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI ({ apiKey: process.env.GEMINI_API_KEY});

async function verifyAIConnection() {
    try {
        console.log('Sending exploratory prompt to Gemini...')

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Respond with exactly: "System online! Google Gemini is successfully bridged.'
        });

        console.log('\n--- AI RESPONSE ---');
        console.log(response.text);
        console.log('--------------------\n')

    } catch (error) {
        console.error('CRITICAL: AI Pipeline Authentication Error!')
        console.error(error.message);
    }
}

verifyAIConnection();