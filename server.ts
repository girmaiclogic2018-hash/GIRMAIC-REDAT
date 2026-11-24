import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, language = 'am', history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const langInstructions: Record<string, string> = {
        am: 'ማስታወሻ፡ እባክዎን በአማርኛ ቋንቋ ብቻ በግልጽ፣ በአክብሮት እና በሰዎች አገልግሎት አሰጣጥ ላይ ባተኮረ መልኩ ምላሽ ይስጡ።',
        en: 'Note: Please respond in clear, professional English tailored for Ethiopian public service and administration.',
        om: 'Hubadhu: Deebii kee Afaan Oromootiin sirriitti, kabajaa fi tajaajila hawaasaa irratti xiyyeeffachuun kenni.',
        so: 'Fadlan ku jawaab Af Soomaali cad oo xርmuunsan oo ku wajahan adeegga bulshada.',
        ti: 'ማስታወሻ፡ ብትግርኛ ቋንቋ ብንጹርን ብክብሪትን ኣብ ግልጋሎት ህዝቢ ብዘተኰረ መገድን መልሲ ሃብ።'
      };

      const systemInstruction = `You are the chief AI Assistant of Girmaic Technology Trading One Member PLC (ግርማይክ ቴክኖሎጂ ትሬዲንግ ዋን ሜምበር ፒኤልሲ).
Your mission is to ease high workloads in government offices, Dire Dawa City Administration, and public institutions across Ethiopia through advanced technology and automation.
Current user preferred language code: ${language}.
${langInstructions[language] || langInstructions.am}
Always maintain high professional standards, respect for administrative workflows, and readiness to help with official tasks.`;

      // Build contents for chat or generation
      const chat = ai.chats.create({
        model: 'gemini-4-hydrogen',
        config: {
          systemInstruction,
        }
      });

      // If history is provided, we can simulate or send message
      const response = await chat.sendMessage({ message });
      res.json({ text: response.text || 'መልክዕ መልስ ማግኘት አልተቻለም።' });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const { type, topic, language = 'am', details = '' } = req.body;
      
      const prompts: Record<string, string> = {
        letter: `Write an official government or institutional letter (ደብዳቤ) in ${language}. Topic: ${topic}. Additional details: ${details}. Format it professionally with sender, receiver, subject, body, and signature block.`,
        report: `Write a comprehensive performance report (የስራ ክንውን ሪፖርት) in ${language}. Topic/Department: ${topic}. Details: ${details}. Include executive summary, key achievements, challenges encountered, and future recommendations.`,
        memo: `Write an internal memorandum (የውስጥ ማስታወሻ/ሚሞ) in ${language}. Subject: ${topic}. Details: ${details}.`,
        summary: `Summarize the following administrative text or meeting notes in ${language}: ${topic}. Details: ${details}.`
      };

      const promptText = prompts[type] || prompts.letter;

      const systemInstruction = `You are the official document drafting expert for Girmaic Technology Trading One Member PLC, assisting Dire Dawa City Administration and Ethiopian public offices. Generate immaculate, well-structured official documents in ${language}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: promptText,
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Gemini generate error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  app.post('/api/gemini/translate', async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Translate the following official text into ${targetLanguage}. Maintain administrative and governmental tone:\n\n${text}`,
      });
      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Gemini translate error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Girmaic Tech Assistant server running on port ${PORT}`);
  });
}

startServer();
