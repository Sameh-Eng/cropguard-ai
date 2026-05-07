const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { default: ollama } = require('ollama');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = 5000;

// Middleware
// Temporarily allow all origins for testing via the local HTML file.
// We will restrict this back to 'http://localhost:5173' later.
app.use(cors());
app.use(express.json());

// Set up multer for handling file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const listResponse = await ollama.list();
    const models = listResponse.models || [];
    const llamaReady = models.some(m => m.name.includes('llama3.2-vision'));
    
    res.json({
      status: 'ok',
      ollama: 'running',
      llamaReady,
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

    console.log("Image received, forwarding to CNN microservice...");

    // 1. Send to Python CNN Microservice
    const formData = new FormData();
    formData.append('image', req.file.buffer, { 
      filename: 'image.jpg', 
      contentType: req.file.mimetype 
    });
    
    let pyResponse;
    try {
      pyResponse = await axios.post('http://localhost:5001/predict', formData, {
        headers: formData.getHeaders()
      });
    } catch (pyError) {
      console.error("CNN Microservice Error:", pyError.message);
      return res.status(503).json({ 
        success: false, 
        error: "CNN Microservice is unavailable. Ensure app.py is running on port 5001." 
      });
    }
    
    if (!pyResponse.data.success) {
      throw new Error(pyResponse.data.error || 'CNN classification failed');
    }
    
    const prediction = pyResponse.data.prediction; // e.g., "Tomato - Late Blight"
    const confidence = pyResponse.data.confidence;

    console.log(`CNN predicted: ${prediction} with ${Math.round(confidence * 100)}% confidence`);

    // 2. Generate detailed JSON report via Ollama (using text model)
    const OLLAMA_PROMPT = `You are an expert agricultural pathologist. A crop image was uploaded and classified by our CNN model as: "${prediction}".
    
    Based on this classification, generate a detailed agricultural report.
    Respond ONLY with a valid JSON object matching the exact format below. Do not include any markdown wrappers, introductory, or trailing text.
    {
      "cropType": "[Extract the crop name from the prediction, e.g. Tomato]",
      "status": "[healthy, diseased, or warning]",
      "diseaseName": "[Extract the disease name from the prediction, or Healthy]",
      "severity": "[None, Low, Moderate, High, or Critical]",
      "affectedArea": "[Estimate percentage, e.g. ~30%]",
      "urgency": "[None, Low, Medium, High, or Immediate]",
      "confidence": ${Math.round(confidence * 100)},
      "diagnosis": "[detailed 2-3 sentence explanation of the symptoms for this disease]",
      "cause": "[1-2 sentences explaining what causes this disease]",
      "treatments": ["[treatment 1]", "[treatment 2]", "[treatment 3]"],
      "prevention": "[2-3 sentences about how to avoid or prevent this disease in the future]"
    }`;

    console.log("Generating report via Ollama...");
    const response = await ollama.chat({
      model: 'llama3.2-vision',
      messages: [{
        role: 'user',
        content: OLLAMA_PROMPT
      }],
      options: {
        temperature: 0.3,
        num_predict: 800
      }
    });

    const outputText = response.message.content;
    console.log("Raw Ollama Output:", outputText);

    // Extract JSON safely
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Ollama did not return valid JSON');
    }

    const result = JSON.parse(jsonMatch[0]);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Node backend server running on http://localhost:${port}`);
});
