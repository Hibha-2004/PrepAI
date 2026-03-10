import { useState } from 'react';
import { api } from '../api';
import s from './Interview.module.css';

export default function Interview({ session, onFinish }) {
  const { role, difficulty, questions } = session;
  const total = questions.length;

  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  const q = questions[currentQ];
  const progress = ((currentQ / total) * 100).toFixed(0);

  async function handleSubmit() {
    if (!answer.trim() || answer.trim().length < 5) {
      setError('Please write a more complete answer before submitting.');
      return;
    }
    setError('');
    setEvaluating(true);
    setFeedback(null);
    try {
      const result = await api.evaluateAnswer({
        question: q.question, answer: answer.trim(),
        difficulty, questionType: q.type
      });
      setFeedback(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  }

  function handleNext() {
    const newResults = [...results, {
      question: q.question,
      type: q.type,
      answer: answer.trim(),
      score: feedback ? feedback.score : 0,
      feedback: feedback || null,
      skipped: !feedback
    }];
    setResults(newResults);

    if (currentQ + 1 >= total) {
      onFinish({ role, difficulty, results: newResults });
    } else {
      setCurrentQ(currentQ + 1);
      setAnswer('');
      setFeedback(null);
      setError('');
    }
  }

  function handleSkip() {
    const newResults = [...results, {
      question: q.question, type: q.type,
      answer: '', score: 0, feedback: null, skipped: true
    }];
    setResults(newResults);
    if (currentQ + 1 >= total) {
      onFinish({ role, difficulty, results: newResults });
    } else {
      setCurrentQ(currentQ + 1);
      setAnswer('');
      setFeedback(null);
      setError('');
    }
  }

  const chipClass = v => v === 'Good' ? s.good : v === 'Fair' ? s.mid : s.low;
  const scoreColor = n => n >= 7 ? 'var(--accent3)' : n >= 4 ? '#ffc850' : 'var(--accent2)';

  return (
    <div className={s.wrap}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.logoText}>Prep<span>AI</span></div>
        <div className={s.roleTag}>{role}</div>
      </header>

      {/* Progress */}
      <div className={s.progressWrap}>
        <div className={s.progressFill} style={{ width: `${progress}%` }}></div>
      </div>

      {/* Meta */}
      <div className={s.meta}>
        <span className={s.qNum}>Question {currentQ + 1} of {total}</span>
        <span className={s.typeBadge}>{q.type}</span>
        <span className={s.diffBadge} data-diff={difficulty.toLowerCase()}>{difficulty}</span>
      </div>

      {/* Question */}
      <div className={s.questionBox}>
        <p>{q.question}</p>
      </div>

      {/* Answer */}
      <div className={`${s.answerBox} ${answer.length > 0 ? s.hasContent : ''}`}>
        <div className={s.answerLabel}>Your Answer</div>
        <textarea
          className={s.textarea}
          placeholder="Type your answer here. Be specific and structured..."
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          disabled={!!feedback || evaluating}
        />
        <div className={s.charCount}>{answer.length} characters</div>
      </div>

      {/* Error */}
      {error && <div className={s.errorBox}>⚠️ {error}</div>}

      {/* Feedback */}
      {(evaluating || feedback) && (
        <div className={s.feedbackCard}>
          <div className={s.feedbackHeader}>
            <div className={s.feedbackIcon}>🤖</div>
            <div className={s.feedbackTitle}>AI Feedback</div>
            {feedback && (
              <div className={s.scoreCircle} style={{ borderColor: scoreColor(feedback.score), color: scoreColor(feedback.score) }}>
                {feedback.score}/10
              </div>
            )}
          </div>

          {evaluating ? (
            <div className={s.loadingDots}>Analyzing your answer<span>.</span><span>.</span><span>.</span></div>
          ) : feedback && (
            <>
              <div className={s.chips}>
                <span className={`${s.chip} ${chipClass(feedback.clarity)}`}>Clarity: {feedback.clarity}</span>
                <span className={`${s.chip} ${chipClass(feedback.depth)}`}>Depth: {feedback.depth}</span>
                <span className={`${s.chip} ${chipClass(feedback.relevance)}`}>Relevance: {feedback.relevance}</span>
              </div>
              <div className={s.feedbackSection}>
                <div className={s.feedbackSectionTitle}>✅ Strengths</div>
                <p>{feedback.strengths}</p>
              </div>
              <div className={s.feedbackSection}>
                <div className={s.feedbackSectionTitle}>💡 Improvements</div>
                <p>{feedback.improvements}</p>
              </div>
              <div className={s.feedbackSection}>
                <div className={s.feedbackSectionTitle}>📌 Sample Answer Outline</div>
                <p className={s.sampleAnswer}>{feedback.sampleAnswer}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className={s.btnRow}>
        {!feedback && !evaluating && (
          <button className={s.skipBtn} onClick={handleSkip}>Skip</button>
        )}
        {!feedback && !evaluating && (
          <button className={s.submitBtn} onClick={handleSubmit}>Submit Answer</button>
        )}
        {feedback && (
          <button className={s.nextBtn} onClick={handleNext}>
            {currentQ + 1 >= total ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}
