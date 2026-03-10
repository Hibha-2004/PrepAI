import { useState } from 'react';
import { api } from '../api';
import s from './Setup.module.css';

const ROLES = [
  'Software Engineer','Data Scientist','Machine Learning Engineer',
  'Data Analyst','Frontend Developer','Backend Developer',
  'Full Stack Developer','Product Manager','DevOps Engineer','Cybersecurity Analyst'
];
const TYPES = ['Technical','Behavioral (HR)','Mixed (Technical + HR)','System Design'];
const COUNTS = [3, 5, 7, 10];
const EXPERIENCES = ['Fresher / Internship','Junior (1-2 yrs)','Mid-level (3-5 yrs)','Senior (5+ yrs)'];
const DIFFICULTIES = ['Easy','Medium','Hard'];

export default function Setup({ onStart }) {
  const [role, setRole] = useState('Software Engineer');
  const [type, setType] = useState('Technical');
  const [count, setCount] = useState(5);
  const [experience, setExperience] = useState('Fresher / Internship');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    setError('');
    setLoading(true);
    try {
      const { questions } = await api.generateQuestions({
        role, type, count, experience, difficulty
      });
      onStart({ role, difficulty, questions });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <div className={s.logoDot}></div>
        <div className={s.logoText}>Prep<span>AI</span></div>
        <div className={s.badge}>v1.0</div>
      </header>

      <div className={s.hero}>
        <h1>Ace your next<br/><em>interview.</em></h1>
        <p>AI-powered mock interviews tailored to your role. Get instant feedback on every answer.</p>
      </div>

      {/* Setup */}
      <div className={s.card}>
        <div className={s.cardLabel}>Interview Setup</div>

        <div className={s.grid2}>
          <div>
            <label className={s.label}>Role / Domain</label>
            <select className={s.select} value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={s.label}>Interview Type</label>
            <select className={s.select} value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className={s.grid2}>
          <div>
            <label className={s.label}>Experience Level</label>
            <select className={s.select} value={experience} onChange={e => setExperience(e.target.value)}>
              {EXPERIENCES.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className={s.label}>Questions</label>
            <select className={s.select} value={count} onChange={e => setCount(Number(e.target.value))}>
              {COUNTS.map(c => <option key={c} value={c}>{c} Questions</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={s.label}>Difficulty</label>
          <div className={s.pillGroup}>
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={`${s.pill} ${s[d.toLowerCase()]} ${difficulty === d ? s.active : ''}`}
                onClick={() => setDifficulty(d)}
              >{d}</button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className={s.errorBox}>⚠️ {error}</div>}

      <button className={s.startBtn} onClick={handleStart} disabled={loading}>
        {loading ? <span className={s.loadingDots}>Generating questions<span>.</span><span>.</span><span>.</span></span> : 'Start Interview →'}
      </button>
    </div>
  );
}
