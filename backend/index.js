import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
const PORT = 5000;

// Updated CORS configuration for Cloudflare tunnels
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://commodity-quantity-dk-valid.trycloudflare.com',
    /https:\/\/.*\.trycloudflare\.com$/ // Allow any trycloudflare.com subdomain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Add this for private network requests
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Additional middleware to handle private network requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});

app.use(express.json());

const gemini_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_key);

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 100,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: geminiConfig,
});

app.get('/', (req, res) => res.send("Hello World"));

app.get('/message', (req, res) => {
  const { username, password, email } = { username: "yukesh", password: "12345", email: "yukesh@example.com" };
  res.send({ username, password, email });
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const prompt = `You are God, speaking casually, using slang and humor. Roast me act super nonchalant and answer this the response shouldn't be more than 100 words : ${message}`;
    
    const result = await geminiModel.generateContent(prompt);
    const response = result.response.text() || "God is silent...";

    console.log(response);
    res.send({ response });
  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).send({ response: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));