const BASE = process.env.REACT_APP_BACKEND_URL 
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : '/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

export const api = {
  async generateQuestions({ role, type, count, experience, difficulty }) {
    const res = await fetch(`${BASE}/generate-questions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ role, type, count, experience, difficulty })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate questions');
    return res.json();
  },

  async evaluateAnswer({ question, answer, difficulty, questionType }) {
    const res = await fetch(`${BASE}/evaluate-answer`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ question, answer, difficulty, questionType })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to evaluate answer');
    return res.json();
  },

  async finalReport({ role, feedbacks, overallScore }) {
    const res = await fetch(`${BASE}/final-report`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ role, feedbacks, overallScore })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate report');
    return res.json();
  },

  async saveSession({ topic, difficulty, totalScore, questions }) {
    const res = await fetch(`${BASE}/sessions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ topic, difficulty, totalScore, questions })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to save session');
    return res.json();
  }
};