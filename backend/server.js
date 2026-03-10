const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Helper to call Gemini
async function callGemini(systemPrompt, userPrompt) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
      ],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 2000,
        responseMimeType: "application/json"
      }
    })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Gemini API error');
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'PrepAI backend is running with Gemini' });
});

// ── Generate Questions ──
app.post('/api/generate-questions', async (req, res) => {
  const { role, type, count, experience, difficulty } = req.body;
  try {
    const systemPrompt = `You are an expert interviewer. Return ONLY a valid JSON array of ${count} interview question objects. Each object must have: "question" (string) and "type" (string: one of Technical, Behavioral, "System Design", HR). No markdown, no explanation, just the raw JSON array.`;
    const userPrompt = `Generate ${count} ${difficulty} level ${type} interview questions for a ${experience} ${role} candidate. Make them realistic, varied, and relevant to the role.`;

    let text = await callGemini(systemPrompt, userPrompt);
    text = text.replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    res.json({ questions: parsed });
  } catch (err) {
    console.error('Generate questions error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Evaluate Answer ──
app.post('/api/evaluate-answer', async (req, res) => {
  const { question, answer, difficulty, questionType } = req.body;
  if (!answer || answer.trim().length < 5) {
    return res.status(400).json({ error: 'Answer too short to evaluate' });
  }
  try {
    const systemPrompt = `You are a strict but fair interview evaluator. Return ONLY valid JSON with these exact fields:
- "score": integer 1-10
- "clarity": "Good" | "Fair" | "Weak"
- "depth": "Good" | "Fair" | "Weak"
- "relevance": "Good" | "Fair" | "Weak"
- "strengths": string (1 sentence on what was good)
- "improvements": string (1-2 sentences of specific actionable improvements)
- "sampleAnswer": string (a brief ideal answer outline in 2-3 sentences)
No markdown, no backticks, just raw JSON.`;
    const userPrompt = `Question Type: ${questionType}\nDifficulty: ${difficulty}\n\nQuestion: ${question}\n\nCandidate Answer: ${answer.replace(/`/g, "'").replace(/\\/g, "/")}`;

    let text = await callGemini(systemPrompt, userPrompt);
    text = text.replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    res.json(result);
  } catch (err) {
    console.error('Evaluate answer error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Generate Final Report ──
app.post('/api/final-report', async (req, res) => {
  const { role, feedbacks, overallScore } = req.body;
  try {
    const summary = feedbacks.map((f, i) =>
      `Q${i + 1}: ${f.question} | Score: ${f.score}/10`
    ).join('\n');

    const systemPrompt = `You are a career coach. Return ONLY valid JSON with: "summary" (2-3 sentence overall performance summary), "topStrength" (string), "topImprovement" (string), "hireable" (boolean), "verdict" ("Strong Hire" | "Hire" | "Maybe" | "No Hire"). No markdown, just JSON.`;
    const userPrompt = `Role: ${role}\nOverall Score: ${overallScore}/10\n\nPerformance:\n${summary}`;

    let text = await callGemini(systemPrompt, userPrompt);
    text = text.replace(/```json|```/g, '').trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    res.json(result);
  } catch (err) {
    console.error('Final report error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 PrepAI Backend running at http://localhost:${PORT}`);
  console.log(`🤖 Using: Google Gemini 2.0 Flash`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});
