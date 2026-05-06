# CropGuard AI — Project Brief for Agent

## 🎯 Project Overview

Build a **Full Stack Web Application** called **CropGuard AI** that allows users to upload a photo of a plant or crop, analyzes it using a **local AI vision model (LLaVA via Ollama)**, and returns a detailed disease diagnosis with treatment recommendations.

- **100% Free** — No paid APIs, runs entirely on local machine
- **Stack:** React (Frontend) + Node.js/Express (Backend) + Ollama LLaVA (AI)
- **Purpose:** Web Development course project — must look professional and production-grade

---

## 🖥️ Target Environment

| Item | Detail |
|---|---|
| OS | Windows |
| GPU | NVIDIA RTX 4060 8GB (Laptop) |
| AI Runtime | Ollama (local) |
| AI Model | `llava:13b` (Vision model, fits in 8GB VRAM) |
| Frontend Port | `http://localhost:5173` (Vite default) |
| Backend Port | `http://localhost:5000` |
| Ollama Port | `http://localhost:11434` (Ollama default) |

---

## 🗂️ Project Structure

```
crop-disease-app/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚙️ Backend Specifications

**File:** `backend/server.js`  
**Framework:** Express.js  
**Dependencies:** `express`, `multer`, `cors`, `ollama`

### Endpoints

#### `POST /api/analyze`
- Accepts: `multipart/form-data` with field name `image`
- Max file size: 10MB
- Converts image to base64
- Sends to Ollama `llava:13b` with a structured prompt
- Returns JSON response with disease analysis

#### `GET /api/health`
- Checks if Ollama is running
- Checks if `llava` model is available
- Returns: `{ status, ollama, llavaReady, models }`

### Ollama Integration
```js
const ollama = require('ollama').default;

const response = await ollama.chat({
  model: 'llava:13b',
  messages: [{
    role: 'user',
    content: prompt,
    images: [imageBase64]  // base64 string, no prefix
  }]
});
```

### AI Prompt (must request this exact JSON shape)
```
You are an expert agricultural pathologist. Analyze this crop/plant image carefully.
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
}
```

### JSON Extraction (safe parsing)
```js
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error('Model did not return valid JSON');
const result = JSON.parse(jsonMatch[0]);
```

### CORS
Allow origin: `http://localhost:5173`

---

## ⚛️ Frontend Specifications

**Framework:** React + Vite  
**Styling:** Plain CSS (no Tailwind needed — custom CSS only)  
**Dependencies:** none extra (just React)

### Features Required

1. **Drag & Drop Upload Zone**
   - Accept image files only (`image/*`)
   - Show image preview after selection
   - "Change Photo" button on preview
   - Visual feedback on drag-over state

2. **Analyze Button**
   - Disabled until image is selected
   - Shows loading state while analyzing
   - Sends image as `FormData` to `POST /api/analyze`

3. **Loading State**
   - Spinner animation
   - Text: "LLaVA AI is analyzing your crop..."
   - Sub-text: "First run may take 30-60 seconds"

4. **Error State**
   - Show error message if API call fails

5. **Results Card** — shown after successful analysis, must display:
   - Disease name (large, prominent)
   - Crop type detected
   - Status badge: `✓ Healthy` / `⚠ Disease Detected` / `◉ Monitor`
   - Info grid: Severity | Affected Area | Urgency
   - Diagnosis paragraph
   - Confidence percentage + progress bar (animated)
   - Treatment list (numbered steps)
   - Prevention paragraph
   - "Analyze Another Crop" reset button

6. **Header**
   - Logo: `🌿 CropGuard AI`
   - Badge: `Local AI • 100% Free`

### API Call Pattern
```js
const formData = new FormData();
formData.append('image', imageFile);

const res = await fetch('http://localhost:5000/api/analyze', {
  method: 'POST',
  body: formData   // Do NOT set Content-Type header manually
});
const data = await res.json();
// data.success === true → data.data contains the result object
// data.success === false → data.error contains error message
```

---

## 🎨 UI Design Guidelines

- **Color Palette:**
  - Dark green: `#1a2e1a` (headers, primary buttons)
  - Medium green: `#4a7c2f` (accents, borders)
  - Light green: `#a8d96c` (badges, highlights)
  - Cream: `#f5f0e8` (background)
  - Rust/orange: `#c4622d` (disease/error states)
  - Gold: `#d4a853` (warning states)

- **Typography:**
  - Headings: `Playfair Display` (serif, from Google Fonts)
  - Body: `DM Sans` (from Google Fonts)

- **Style:**
  - Rounded cards (`border-radius: 24px`)
  - Subtle shadows
  - Smooth transitions on hover
  - Professional, clean, nature-inspired aesthetic

---

## 🚀 Setup & Run Instructions (include in README)

```bash
# Step 1 — Install Ollama
# Download from https://ollama.com and install on Windows

# Step 2 — Pull the vision model (one time only, ~8GB)
ollama pull llava:13b

# Step 3 — Start Ollama server
ollama serve

# Step 4 — Backend
cd backend
npm install
node server.js

# Step 5 — Frontend (in a new terminal)
cd frontend
npm create vite@latest . -- --template react
npm install
npm run dev

# Step 6 — Open browser
# http://localhost:5173
```

---

## 📋 package.json Files

**`backend/package.json`:**
```json
{
  "name": "cropguard-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "ollama": "^0.5.0"
  }
}
```

**`frontend/package.json`:** standard Vite + React (generated by `npm create vite@latest`)

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] User can drag & drop OR click to upload an image
- [ ] Image preview shown after selection
- [ ] Clicking "Analyze" sends image to backend
- [ ] Backend calls Ollama `llava:13b` with the image
- [ ] Result JSON is parsed and returned to frontend
- [ ] All result fields displayed correctly in the UI
- [ ] Loading state shown during analysis
- [ ] Error state shown if anything fails
- [ ] "Analyze Another Crop" resets everything
- [ ] App runs fully offline with no paid services
- [ ] UI looks professional (not a basic/ugly form)

---

## ⚠️ Important Notes for Agent

1. **Do NOT use `Content-Type: multipart/form-data` header manually** — let the browser set it with the boundary automatically when using `FormData`
2. **Ollama must be running** (`ollama serve`) before starting the backend
3. **First inference is slow** (model loads into VRAM) — subsequent ones are fast
4. **Image base64 for Ollama** — pass raw base64 string without the `data:image/...;base64,` prefix
5. **JSON parsing** — LLaVA sometimes wraps JSON in markdown code blocks, always use regex extraction: `text.match(/\{[\s\S]*\}/)`
6. **CORS** — backend must allow `http://localhost:5173` explicitly
