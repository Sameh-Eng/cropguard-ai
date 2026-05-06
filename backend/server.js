const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { default: ollama } = require('ollama');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// Set up multer for handling file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const AI_PROMPT = `You are an expert agricultural pathologist. Analyze this crop/plant image carefully.
Respond ONLY with a valid JSON object, no extra text:
{
  "cropType": "name of the crop or plant",
  "status": "healthy" or "diseased" or "warning",
  "diseaseName": "specific disease name or 'Healthy Plant'",
  "severity": "None" or "Low" or "Moderate" or "High" or "Critical",
  "affectedArea": "percentage like '30-40%' or 'None'",
  "urgency": "None" or "Low" or "Medium" or "High" or "Immediate",
  "confidence": number between 60 and 98,
  "diagnosis": "detailed 2-3 sentence explanation",
  "treatments": ["treatment 1", "treatment 2", "treatment 3", "treatment 4"],
  "prevention": "2-3 sentences about prevention"
}`;

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const listResponse = await ollama.list();
    const models = listResponse.models || [];
    const llavaReady = models.some(m => m.name.includes('llava:13b'));
    
    res.json({
      status: 'ok',
      ollama: 'running',
      llavaReady,
      models: models.map(m => m.name)
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      ollama: 'not running',
      error: error.message
    });
  }
});

// Analyze endpoint
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    // Convert image buffer to base64 string
    const imageBase64 = req.file.buffer.toString('base64');

    // Call Ollama
    const response = await ollama.chat({
      model: 'llava:13b',
      messages: [{
        role: 'user',
        content: AI_PROMPT,
        images: [imageBase64]
      }]
    });

    const outputText = response.message.content;

    // Extract JSON safely
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Model did not return valid JSON');
    }

    const result = JSON.parse(jsonMatch[0]);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
