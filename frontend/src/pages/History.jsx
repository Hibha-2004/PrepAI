import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const History = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history-container">
      <h2>Interview History</h2>

      {sessions.length === 0 ? (
        <p className="no-history">No sessions yet. Start your first interview!</p>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session._id} className="session-card">
              <div
                className="session-header"
                onClick={() => setExpanded(expanded === session._id ? null : session._id)}
              >
                <div className="session-info">
                  <span className="session-topic">{session.topic}</span>
                  <span className={`session-difficulty ${session.difficulty}`}>
                    {session.difficulty}
                  </span>
                </div>
                <div className="session-meta">
                  <span className="session-score">Score: {session.totalScore}</span>
                  <span className="session-date">{formatDate(session.createdAt)}</span>
                  <span className="expand-icon">{expanded === session._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === session._id && (
                <div className="session-questions">
                  {session.questions.map((q, i) => (
                    <div key={i} className="question-item">
                      <p className="q-text"><strong>Q{i + 1}:</strong> {q.question}</p>
                      {q.skipped ? (
                        <p className="q-skipped">Skipped</p>
                      ) : (
                        <>
                          {q.feedback && (
                            <div className="q-feedback">
                              <strong>Feedback:</strong>
                              <span> Clarity: {q.feedback.clarity} · Depth: {q.feedback.depth} · Relevance: {q.feedback.relevance}</span>
                              {q.feedback.improvements && <p>{q.feedback.improvements}</p>}
                            </div>
                          )}
                          <p className="q-score"><strong>Score:</strong> {q.score}/10</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;