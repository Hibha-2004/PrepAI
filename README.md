# 🎯 PrepAI — AI Mock Interview App

An AI-powered mock interview application built with **React**, **Node.js**, and **Google Gemini API**. Practice interviews and get instant AI feedback on every answer.

---

## 🌐 Live Demo 

🔗 https://prep-ai-roan.vercel.app)

---

## 🚀 Features

- 🤖 AI-generated questions based on your role and difficulty
- 📊 Instant feedback with score, clarity, depth, and relevance ratings
- 💡 Sample answers provided after each question
- 🏆 Final report with hire/no-hire verdict
- 🎨 Clean dark UI

---

## 🛠️ Tech Stack

- **Frontend** — React
- **Backend** — Node.js, Express
- **AI** — Google Gemini 2.5 Flash

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+ → https://nodejs.org
- Google Gemini API Key (free) → https://aistudio.google.com/api-keys

### 1. Clone the repository
```bash
git clone https://github.com/Hibha-2004/PrepAI.git
cd PrepAI
```

### 2. Install dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd ../frontend
npm install
```

### 3. Add your API key

Open `backend/.env` and add your Gemini API key:
```
PORT=5000
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Run the app

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

Open **http://localhost:3000** in your browser. ✅

---

## 📁 Project Structure

```
PrepAI/
├── backend/
│   ├── server.js       # Express API server
│   ├── .env            # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   │       ├── Setup.jsx
│   │       ├── Interview.jsx
│   │       └── Results.jsx
│   └── package.json
└── README.md
```

---

## 📌 Note
This app uses the **Google Gemini free tier** (20 requests/min). If you hit the limit, just wait a minute and try again.

---

*Built by Hibha Singh Mehrok — B.Tech Portfolio Project*
