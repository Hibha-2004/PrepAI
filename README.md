# 🎯 PrepAI — AI Mock Interview App

A full-stack AI-powered mock interview application built with **React** (frontend) and **Node.js + Express** (backend), powered by **Claude (Anthropic API)**.

---

## 📁 Project Structure

```
prepai/
├── backend/
│   ├── server.js        # Express API server
│   ├── package.json
│   └── .env             # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx              # Main app with screen routing
│   │   ├── api.js               # API service layer
│   │   ├── index.js             # React entry point
│   │   ├── index.css            # Global styles
│   │   └── components/
│   │       ├── Setup.jsx        # Interview setup screen
│   │       ├── Setup.module.css
│   │       ├── Interview.jsx    # Live interview screen
│   │       ├── Interview.module.css
│   │       ├── Results.jsx      # Results & report screen
│   │       └── Results.module.css
│   └── package.json
├── package.json         # Root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or above → https://nodejs.org
- **Anthropic API Key** → https://console.anthropic.com

---

### Step 1: Install Dependencies

Open **two terminals**.

**Terminal 1 — Backend:**
```bash
cd prepai/backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd repai/frontend
npm install
```

---

### Step 2: Configure Environment

Edit `backend/.env`:
```
PORT=5000
```
*(Your API key is entered in the app UI — it's never stored on disk)*

---

### Step 3: Run the App

**Terminal 1 — Start Backend:**
```bash
cd prepai/backend
npm start
# OR for auto-reload during development:
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 — Start Frontend:**
```bash
cd prepai/frontend
npm start
```
Frontend opens at: http://localhost:3000

---

## 🎮 How to Use

1. **Enter your Anthropic API key** (get one at console.anthropic.com → API Keys → Create Key)
2. Click **Verify** to validate the key
3. **Configure your interview:**
   - Select Role (Software Engineer, Data Scientist, etc.)
   - Choose Interview Type (Technical, HR, Mixed, System Design)
   - Set Experience Level and Number of Questions
   - Pick Difficulty (Easy / Medium / Hard)
4. Click **Start Interview →**
5. Answer each question in the text box
6. Click **Submit Answer** to get instant AI feedback with:
   - Score out of 10
   - Clarity / Depth / Relevance ratings
   - Strengths and improvement suggestions
   - Sample answer outline
7. Navigate through all questions
8. View your **Results screen** with:
   - Overall average score
   - AI-generated Hire/No-Hire verdict
   - Full question-by-question breakdown

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/verify-key` | Validate Anthropic API key |
| POST | `/api/generate-questions` | Generate interview questions |
| POST | `/api/evaluate-answer` | Evaluate a candidate's answer |
| POST | `/api/final-report` | Generate final performance report |

---

## ✨ Features

- 🤖 **AI-generated questions** tailored to role, type, and difficulty
- 📊 **Instant feedback** — score, clarity, depth, relevance
- 💡 **Sample answers** provided after each question
- 🏆 **Final report** with hire verdict and performance summary
- 🎨 **Dark UI** with clean, modern design
- 🔐 **API key stays in browser** — never logged or stored

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Modules |
| Backend | Node.js, Express |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Styling | Custom CSS, Google Fonts (Syne + DM Mono) |

---

## 🌐 Deploy on Netlify (Frontend Only)

```bash
cd frontend
npm run build
# Drag the /build folder to Netlify, or connect your GitHub repo
```

For backend, deploy on **Railway**, **Render**, or **Heroku**.

---

## 👩‍💻 Built by Hibha
*B.Tech Project — showcasing Full Stack + AI integration*
