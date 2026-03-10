import { useState, useEffect } from 'react';
import { api } from '../api';
import s from './Results.module.css';

export default function Results({ data, onRestart }) {
  const { role, difficulty, results } = data;
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);

  const answered = results.filter(r => !r.skipped);
  const totalScore = answered.reduce((sum, r) => sum + r.score, 0);
  const avgScore = answered.length ? (totalScore / answered.length).toFixed(1) : '0.0';
  const maxPossible = results.length * 10;

  const scoreColor = n => parseFloat(n) >= 7 ? 'var(--accent3)' : parseFloat(n) >= 4 ? '#ffc850' : 'var(--accent2)';
  const chipClass = v => v === 'Good' ? s.good : v === 'Fair' ? s.mid : s.low;

  useEffect(() => {
    async function fetchReport() {
      try {
        const feedbacks = results.map(r => ({ question: r.question, score: r.score, skipped: r.skipped }));
        const res = await api.finalReport({ role, feedbacks, overallScore: avgScore });
        setReport(res);
      } catch { setReport(null); }
      finally { setLoadingReport(false); }
    }
    fetchReport();
  }, []);

  const verdictColor = v => {
    if (!v) return 'var(--muted)';
    if (v === 'Strong Hire') return 'var(--accent3)';
    if (v === 'Hire') return '#6adfff';
    if (v === 'Maybe') return '#ffc850';
    return 'var(--accent2)';
  };

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <div className={s.logoText}>Prep<span>AI</span></div>
        <div className={s.roleTag}>{role}</div>
      </header>

      {/* Overall score */}
      <div className={s.heroSection}>
        <h2>Interview Complete 🎉</h2>
        <p className={s.sub}>Here's your full performance breakdown</p>

        <div className={s.scoreRow}>
          <div className={s.scoreCircle} style={{ borderColor: scoreColor(avgScore), boxShadow: `0 0 40px ${scoreColor(avgScore)}22` }}>
            <div className={s.scoreNum} style={{ color: scoreColor(avgScore) }}>{avgScore}</div>
            <div className={s.scoreDen}>/ 10 avg</div>
          </div>

          <div className={s.statsGrid}>
            <div className={s.statBox}>
              <div className={s.statNum}>{answered.length}</div>
              <div className={s.statLabel}>Answered</div>
            </div>
            <div className={s.statBox}>
              <div className={s.statNum}>{results.length - answered.length}</div>
              <div className={s.statLabel}>Skipped</div>
            </div>
            <div className={s.statBox}>
              <div className={s.statNum}>{totalScore}</div>
              <div className={s.statLabel}>Total Score</div>
            </div>
            <div className={s.statBox}>
              <div className={s.statNum}>{maxPossible}</div>
              <div className={s.statLabel}>Max Possible</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Report */}
      <div className={s.reportCard}>
        <div className={s.cardLabel}>AI Evaluation Report</div>
        {loadingReport ? (
          <div className={s.loadingDots}>Generating report<span>.</span><span>.</span><span>.</span></div>
        ) : report ? (
          <>
            <div className={s.verdictRow}>
              <span className={s.verdictLabel}>Verdict:</span>
              <span className={s.verdictValue} style={{ color: verdictColor(report.verdict) }}>{report.verdict}</span>
            </div>
            <p className={s.summaryText}>{report.summary}</p>
            <div className={s.reportGrid}>
              <div className={s.reportItem}>
                <div className={s.reportItemTitle}>✅ Top Strength</div>
                <p>{report.topStrength}</p>
              </div>
              <div className={s.reportItem}>
                <div className={s.reportItemTitle}>🎯 Key Improvement</div>
                <p>{report.topImprovement}</p>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Could not generate report.</p>
        )}
      </div>

      {/* Per-question breakdown */}
      <div className={s.cardLabel} style={{ marginBottom: '12px' }}>Question Breakdown</div>
      <div className={s.resultList}>
        {results.map((r, i) => (
          <div key={i} className={s.resultItem}>
            <div className={s.resultMeta}>
              <span className={s.resultQNum}>Q{i + 1}</span>
              <span className={s.resultType}>{r.type}</span>
              {r.skipped && <span className={s.skippedTag}>Skipped</span>}
              {!r.skipped && (
                <span className={s.resultScore} style={{ color: scoreColor(r.score) }}>{r.score}/10</span>
              )}
            </div>
            <p className={s.resultQ}>{r.question}</p>
            {!r.skipped && r.feedback && (
              <div className={s.resultFeedback}>
                <div className={s.miniChips}>
                  <span className={`${s.miniChip} ${chipClass(r.feedback.clarity)}`}>Clarity: {r.feedback.clarity}</span>
                  <span className={`${s.miniChip} ${chipClass(r.feedback.depth)}`}>Depth: {r.feedback.depth}</span>
                  <span className={`${s.miniChip} ${chipClass(r.feedback.relevance)}`}>Relevance: {r.feedback.relevance}</span>
                </div>
                <p className={s.feedbackText}>{r.feedback.improvements}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className={s.restartBtn} onClick={onRestart}>← Start New Interview</button>
    </div>
  );
}
