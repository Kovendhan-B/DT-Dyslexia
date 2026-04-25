import React, { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Star, CheckCircle, BookOpen, Gamepad2, Brain, Activity, Clock, Award, Flame, Trophy, RefreshCw } from 'lucide-react';
import { t } from '../i18n/translations';
import { fetchProgress } from '../services/api';

// ─── Relative time helper ─────────────────────────────────────────────────────
function relativeTime(isoString) {
  if (!isoString) return 'Recently';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 2)   return 'Just now';
  if (mins  < 60)  return `${mins} mins ago`;
  if (hours < 24)  return `${hours} hours ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const ACTION_META = {
  login:              { Icon: CheckCircle, color: '#4f46e5', label: 'Logged in' },
  task_complete:      { Icon: Star,        color: '#f59e0b', label: 'Completed task' },
  lesson_complete:    { Icon: BookOpen,    color: '#34d399', label: 'Finished lesson' },
  game_complete:      { Icon: Gamepad2,    color: '#818cf8', label: 'Completed game' },
  test_complete:      { Icon: Trophy,      color: '#f472b6', label: 'Completed test' },
  alphabet_unlocked:  { Icon: Brain,       color: '#67e8f9', label: 'Unlocked letter' },
  number_unlocked:    { Icon: Brain,       color: '#fb923c', label: 'Unlocked number' },
  tracing_complete:   { Icon: CheckCircle, color: '#a3e635', label: 'Traced letter' },
};

function getActionMeta(action) {
  return ACTION_META[action] || { Icon: Activity, color: '#94a3b8', label: action };
}

function getSkillLevel(type, progress) {
  const tests    = progress?.testsCompleted ?? [];
  const getScore = (id) => tests.find(t => t.id === id)?.score ?? 0;
  if (type === 'reading')  {
    const score = Math.max(getScore('reading'), getScore('sightwords'));
    return score > 0 ? Math.min(score, 100) : Math.round(((progress?.unlockedAlpha ?? 0) / 26) * 30);
  }
  if (type === 'writing')   return Math.round(((progress?.unlockedAlpha ?? 0) / 26) * 100);
  if (type === 'listening') {
    const score = getScore('phonics');
    return score > 0 ? Math.min(score, 100) : ((progress?.gamesCompleted ?? []).includes('sound') ? 50 : 0);
  }
  if (type === 'memory')    return Math.min(Math.round(((progress?.gamesCompleted ?? []).length / 6) * 100), 100);
  return 0;
}

function getStrengthInsight(progress) {
  const tests = progress?.testsCompleted ?? [];
  const hasId = (id) => tests.some(t => t.id === id);
  if (hasId('phonics') && hasId('reading')) return 'Exceptional auditory and reading comprehension!';
  if (hasId('alphabet')) return 'Great start with Letter Recognition and alphabets.';
  if (hasId('sentence')) return 'Strong understanding of sentence structures.';
  if ((progress?.lessonsCompleted ?? []).length > 0) return 'Great progress in lessons! Keep going.';
  return "Your child is just getting started! Encourage them to try the Alphabet Lesson first.";
}
function getRecommendation(progress) {
  const tests = progress?.testsCompleted ?? [];
  const hasId = (id) => tests.some(t => t.id === id);
  if (!hasId('phonics') && hasId('alphabet')) return 'Practice Phonics sounds to improve letter-sound associations.';
  if (!hasId('sentence') && hasId('reading')) return 'Try the Sentence Formation tests for structural learning.';
  if (!hasId('reading')) return 'Practice tracing and simple reading flashcards.';
  return 'Keep up the momentum! Allow them to explore the Games hub freely.';
}

// ─── Stat cards config ────────────────────────────────────────────────────────
function buildStats(progress, tr) {
  const testsCompleted   = progress?.testsCompleted   ?? [];
  const lessonsCompleted = progress?.lessonsCompleted ?? [];
  const gamesCompleted   = progress?.gamesCompleted   ?? [];
  const totalXP          = progress?.totalXP          ?? 0;
  const streakCount      = progress?.streak?.count    ?? 0;
  return [
    { Icon: Star,    bg: '#fefce8', color: '#f59e0b', label: tr('totalScore'),   value: `${totalXP} XP` },
    { Icon: BookOpen,bg: '#f0fdf4', color: '#34d399', label: tr('lessonsViewed'),value: lessonsCompleted.length },
    { Icon: Gamepad2,bg: '#eff6ff', color: '#60a5fa', label: tr('gamesPlayed'),  value: gamesCompleted.length },
    { Icon: Award,   bg: '#fdf4ff', color: '#c084fc', label: tr('testsMastered'),value: `${testsCompleted.length} / 7` },
    { Icon: Flame,   bg: '#fff1f2', color: '#f87171', label: tr('currentStreak'),value: `${streakCount} ${tr('days')}` },
  ];
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ParentsPortal({ onBack, progress: propProgress, language }) {
  const tr = (key) => t(language, key);

  // Fetch fresh progress from API every time the portal opens
  const [liveProgress, setLiveProgress] = useState(propProgress);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const refresh = () => {
    setLoading(true);
    setError(null);
    fetchProgress()
      .then(data => { setLiveProgress(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { refresh(); }, []);

  const progress = liveProgress;

  const testsCompleted = progress?.testsCompleted   ?? [];
  const weeklyStars    = progress?.weeklyStars       ?? 0;
  const sessionLog     = progress?.sessionLog        ?? [];

  const SKILLS = [
    { label: tr('reading'),  type: 'reading',   color: '#f472b6' },
    { label: tr('writing'),  type: 'writing',   color: '#67e8f9' },
    { label: tr('auditory'), type: 'listening', color: '#fb923c' },
    { label: tr('memory'),   type: 'memory',    color: '#4ade80' },
  ];
  const STATS = buildStats(progress, tr);

  return (
    <div className="pp-root">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="pp-header">
        <button className="pp-header-back" onClick={onBack}>
          <ChevronLeft size={18} /> {tr('backToStudent')}
        </button>
        <h1 className="pp-header-title">
          <TrendingUp size={30} /> {tr('analyticsTitle')}
        </h1>
        <p className="pp-header-sub">{tr('analyticsSubtitle')}</p>
        <button
          onClick={refresh}
          style={{
            marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: '1px solid #a5b4fc', borderRadius: '20px',
            padding: '0.3rem 0.9rem', color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem'
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
        {error && (
          <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            ⚠️ Could not refresh: {error}
          </p>
        )}
      </div>

      <div className="pp-content">

        {/* ── TOP STATS ─────────────────────────────────────────── */}
        <div className="pp-stats-grid">
          {STATS.map(({ Icon, bg, color, label, value }) => (
            <div key={label} className="pp-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
              <div className="pp-stat-icon" style={{ background: bg }}>
                <Icon size={28} color={color} />
              </div>
              <div>
                <div className="pp-stat-label">{label}</div>
                <div className="pp-stat-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SKILL BARS + INSIGHTS ─────────────────────────────── */}
        <div className="pp-two-col">
          <div className="pp-card">
            <h2 className="pp-card-title">
              <Brain size={22} color="#818cf8" /> {tr('skillDev')}
            </h2>
            {SKILLS.map(skill => {
              const val  = getSkillLevel(skill.type, progress);
              const desc = val >= 75 ? tr('good') : val >= 40 ? tr('improving') : tr('beginner');
              return (
                <div key={skill.type} className="pp-skill-item">
                  <div className="pp-skill-label-row">
                    <span>{skill.label}</span>
                    <span style={{ color: skill.color, fontWeight: 700, fontSize: '0.85rem' }}>{desc} ({val}%)</span>
                  </div>
                  <div className="pp-skill-track">
                    <div className="pp-skill-fill" style={{ width: `${val}%`, background: skill.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="pp-insight" style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
              <h3 className="pp-insight-title" style={{ color: '#d97706' }}>{tr('strengths')}</h3>
              <p className="pp-insight-text">{getStrengthInsight(progress)}</p>
            </div>
            <div className="pp-insight" style={{ background: '#fdf4ff', borderColor: '#d8b4fe' }}>
              <h3 className="pp-insight-title" style={{ color: '#7c3aed' }}>{tr('recommended')}</h3>
              <p className="pp-insight-text">{getRecommendation(progress)}</p>
            </div>
            <div className="pp-insight" style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
              <h3 className="pp-insight-title" style={{ color: '#16a34a' }}>
                ⭐ {language === 'ta' ? 'இந்த வாரம்' : 'This Week'}
              </h3>
              <p className="pp-insight-text" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803d' }}>
                {weeklyStars} {language === 'ta' ? 'நட்சத்திரங்கள்' : 'Stars'}
              </p>
            </div>
          </div>
        </div>

        {/* ── TEST HISTORY ─────────────────────────────────────────── */}
        <div className="pp-card" style={{ marginBottom: '1.5rem' }}>
          <h2 className="pp-card-title">
            <Trophy size={22} color="#f472b6" /> {tr('testHistory')}
          </h2>
          {testsCompleted.length === 0 ? (
            <p style={{ color: 'var(--surf-muted)', textAlign: 'center', padding: '1.5rem 0' }}>{tr('noTests')}</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="pp-table">
                <thead>
                  <tr>
                    {['Test', tr('score'), tr('date')].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testsCompleted.map((tc) => {
                    const pct   = tc.score;
                    const color = pct >= 80 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
                    const bg    = pct >= 80 ? '#f0fdf4' : pct >= 50 ? '#fffbeb' : '#fff1f2';
                    return (
                      <tr key={tc.id}>
                        <td style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                          {tc.id.replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </td>
                        <td>
                          <span className="pp-score-badge" style={{ background: bg, color }}>
                            {tc.score} pts
                          </span>
                        </td>
                        <td style={{ color: 'var(--surf-muted)', fontSize: '0.9rem' }}>{tc.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── ACTIVITY TIMELINE ─────────────────────────────────────── */}
        <div className="pp-card">
          <h2 className="pp-card-title">
            <Activity size={22} color="#60a5fa" /> {tr('activityLog')}
          </h2>
          {sessionLog.length === 0 ? (
            <p style={{ color: 'var(--surf-muted)', textAlign: 'center', padding: '1.5rem 0' }}>{tr('noActivity')}</p>
          ) : (
            <div className="pp-timeline">
              {sessionLog.slice(0, 20).map((act, i) => {
                const meta = getActionMeta(act.action);
                const Icon = meta.Icon;
                return (
                  <div key={i} className="pp-timeline-item">
                    <div className="pp-timeline-icon" style={{ background: meta.color }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="pp-timeline-name">
                        {meta.label}{act.detail ? `: ${act.detail}` : ''}
                      </div>
                      <div className="pp-timeline-time">
                        <Clock size={12} /> {relativeTime(act.date)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
