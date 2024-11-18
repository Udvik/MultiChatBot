const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const genAI1 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY1);
const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2)
const genAI3 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY3)


const model1 = genAI1.getGenerativeModel({ model: 'gemini-1.0-pro' });
const model2 = genAI2.getGenerativeModel({ model: 'gemini-1.5-pro' });
const model3 = genAI3.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const bot1Result = await model1.generateContent(userMessage);
    const bot2Result = await model2.generateContent(userMessage);
    const bot3Result = await model3.generateContent(userMessage);

    const bot1Reply = formatResponse(bot1Result.response.text());
    const bot2Reply = formatResponse(bot2Result.response.text());
    const bot3Reply = formatResponse(bot3Result.response.text());

    res.json({ reply1: bot1Reply, reply2: bot2Reply, reply3: bot3Reply });
  } catch (error) {
    console.error('Error communicating with Gemini models:', error);
    res.status(500).json({ error: 'An error occurred while contacting the chatbots.' });
  }
});


function formatResponse(responseText) {
  let formattedText = responseText.replace(/\n/g, '<br><br>');
  formattedText = formattedText.replace(/## (.*?)<br>/g, '<h2>$1</h2>');
  formattedText = formattedText.replace(/### (.*?)<br>/g, '<h3>$1</h3>');
  formattedText = formattedText.replace(/\*\s(.*?)(<br>|$)/g, '<li>$1</li>');
  formattedText = formattedText.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return formattedText;
}


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
