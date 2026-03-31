import React from 'react';
import { ChevronLeft, TrendingUp, Star, CheckCircle, BookOpen, Gamepad2, Brain, Activity, Clock, Award, Flame, Trophy } from 'lucide-react';
import { t } from '../i18n/translations';

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

// ─── Activity icon map ────────────────────────────────────────────────────────
const ACTION_META = {
  login:              { Icon: CheckCircle, color: '#2196F3', label: 'Logged in' },
  task_complete:      { Icon: Star,        color: '#FF9800', label: 'Completed task' },
  lesson_complete:    { Icon: BookOpen,    color: '#4CAF50', label: 'Finished lesson' },
  game_complete:      { Icon: Gamepad2,    color: '#9C27B0', label: 'Completed game' },
  test_complete:      { Icon: Trophy,      color: '#E91E63', label: 'Completed test' },
  alphabet_unlocked:  { Icon: Brain,       color: '#00BCD4', label: 'Unlocked letter' },
  number_unlocked:    { Icon: Brain,       color: '#FF5722', label: 'Unlocked number' },
};

function getActionMeta(action) {
  return ACTION_META[action] || { Icon: Activity, color: '#607D8B', label: action };
}

// ─── Skill level calculator (real) ───────────────────────────────────────────
function getSkillLevel(type, progress) {
  const tests    = progress?.testsCompleted ?? [];
  const getScore = (id) => tests.find(t => t.id === id)?.score ?? 0;

  if (type === 'reading') {
    const score = Math.max(getScore('reading'), getScore('sightwords'));
    return score > 0 ? Math.min(score, 100) : ((progress?.unlockedAlpha ?? 0) / 26) * 30;
  }
  if (type === 'writing') {
    return Math.round(((progress?.unlockedAlpha ?? 0) / 26) * 100);
  }
  if (type === 'listening') {
    const score = getScore('phonics');
    return score > 0 ? Math.min(score, 100) : ((progress?.gamesCompleted ?? []).includes('sound') ? 50 : 15);
  }
  if (type === 'memory') {
    const gamesCount = (progress?.gamesCompleted ?? []).length;
    return Math.min(Math.round((gamesCount / 6) * 100), 100);
  }
  return 0;
}

// ─── Insight generators ───────────────────────────────────────────────────────
function getStrengthInsight(progress) {
  const tests    = progress?.testsCompleted ?? [];
  const hasId    = (id) => tests.some(t => t.id === id);
  if (hasId('phonics') && hasId('reading')) return 'Exceptional auditory and reading comprehension!';
  if (hasId('alphabet')) return 'Great start with Letter Recognition and alphabets.';
  if (hasId('sentence')) return 'Strong understanding of sentence structures.';
  if ((progress?.lessonsCompleted ?? []).length > 0) return 'Great progress in lessons! Keep going.';
  return "Your child is just getting started! Encourage them to try the Alphabet Lesson first.";
}

function getRecommendation(progress) {
  const tests    = progress?.testsCompleted ?? [];
  const hasId    = (id) => tests.some(t => t.id === id);
  if (!hasId('phonics') && hasId('alphabet')) return 'Practice Phonics sounds to improve letter-sound associations.';
  if (!hasId('sentence') && hasId('reading')) return 'Try the Sentence Formation tests for structural learning.';
  if (!hasId('reading'))  return 'Practice tracing and simple reading flashcards.';
  return 'Keep up the momentum! Allow them to explore the Games hub freely.';
}

// ══════════════════════════════════════════════════════════════════════════════
export default function ParentsPortal({ onBack, progress, language }) {
  const tr = (key) => t(language, key);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const testsCompleted   = progress?.testsCompleted   ?? [];
  const lessonsCompleted = progress?.lessonsCompleted  ?? [];
  const gamesCompleted   = progress?.gamesCompleted    ?? [];
  const totalXP          = progress?.totalXP           ?? 0;
  const streakCount      = progress?.streak?.count     ?? 0;
  const sessionLog       = progress?.sessionLog        ?? [];
  const weeklyStars      = progress?.weeklyStars       ?? 0;

  const SKILLS = [
    { label: tr('reading'),  type: 'reading',   color: '#E91E63' },
    { label: tr('writing'),  type: 'writing',   color: '#00BCD4' },
    { label: tr('auditory'), type: 'listening', color: '#FF9800' },
    { label: tr('memory'),   type: 'memory',    color: '#4CAF50' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1A237E, #3949AB)', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
            <ChevronLeft size={20} /> {tr('backToStudent')}
          </button>
          <h1 style={{ fontSize: '2.5rem', margin: '1.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TrendingUp size={36} /> {tr('analyticsTitle')}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '1.2rem' }}>{tr('analyticsSubtitle')}</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* ── TOP STATS ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>

          {[
            { icon: <Star size={32} color="#FFB300" />, bg: '#FFF8E1', border: '#FFC107', label: tr('totalScore'),   value: `${totalXP} XP` },
            { icon: <BookOpen size={32} color="#43A047" />, bg: '#E8F5E9', border: '#4CAF50', label: tr('lessonsViewed'), value: lessonsCompleted.length },
            { icon: <Gamepad2 size={32} color="#1E88E5" />, bg: '#E3F2FD', border: '#2196F3', label: tr('gamesPlayed'),   value: gamesCompleted.length },
            { icon: <Award size={32} color="#8E24AA" />,  bg: '#F3E5F5', border: '#9C27B0', label: tr('testsMastered'),  value: `${testsCompleted.length} / 7` },
            { icon: <Flame size={32} color="#F44336" />,  bg: '#FFEBEE', border: '#F44336', label: tr('currentStreak'), value: `${streakCount} ${tr('days')}` },
          ].map(({ icon, bg, border, label, value }) => (
            <div key={label} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.2rem', borderLeft: `6px solid ${border}` }}>
              <div style={{ backgroundColor: bg, padding: '1.2rem', borderRadius: '15px' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SKILL BARS + INSIGHTS ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '3rem' }}>

          {/* Skill Bars */}
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#333', marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Brain size={28} color="#9C27B0" /> {tr('skillDev')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {SKILLS.map(skill => {
                const val  = getSkillLevel(skill.type, progress);
                const desc = val >= 75 ? tr('good') : val >= 40 ? tr('improving') : tr('beginner');
                return (
                  <div key={skill.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                      <span>{skill.label}</span>
                      <span style={{ color: skill.color }}>{desc} ({val}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: '#F5F5F5', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${val}%`, height: '100%', backgroundColor: skill.color, borderRadius: '10px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#FFFDF5', padding: '2rem', borderRadius: '24px', border: '2px solid #FFE082', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#F57C00', marginTop: 0, marginBottom: '1rem' }}>{tr('strengths')}</h3>
              <p style={{ color: '#555', lineHeight: 1.6, margin: 0 }}>{getStrengthInsight(progress)}</p>
            </div>
            <div style={{ backgroundColor: '#F3E5F5', padding: '2rem', borderRadius: '24px', border: '2px solid #CE93D8', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#8E24AA', marginTop: 0, marginBottom: '1rem' }}>{tr('recommended')}</h3>
              <p style={{ color: '#555', lineHeight: 1.6, margin: 0 }}>{getRecommendation(progress)}</p>
            </div>
            <div style={{ backgroundColor: '#E8F5E9', padding: '2rem', borderRadius: '24px', border: '2px solid #A5D6A7' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#2E7D32', marginTop: 0, marginBottom: '0.5rem' }}>⭐ {language === 'ta' ? 'இந்த வாரம்' : 'This Week'}</h3>
              <p style={{ color: '#555', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{weeklyStars} {language === 'ta' ? 'நட்சத்திரங்கள்' : 'Stars'}</p>
            </div>
          </div>
        </div>

        {/* ── TEST HISTORY TABLE ───────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Trophy size={28} color="#E91E63" /> {tr('testHistory')}
          </h2>

          {testsCompleted.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', fontSize: '1.2rem', padding: '2rem 0' }}>{tr('noTests')}</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8F9FA' }}>
                    {['Test', tr('score'), tr('date')].map(h => (
                      <th key={h} style={{ padding: '1rem', textAlign: 'left', color: '#666', fontWeight: 'bold', borderBottom: '2px solid #EEE' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testsCompleted.map((tc) => {
                    const pct   = tc.score;
                    const color = pct >= 80 ? '#4CAF50' : pct >= 50 ? '#FF9800' : '#F44336';
                    return (
                      <tr key={tc.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                        <td style={{ padding: '1rem', fontWeight: 'bold', color: '#333', textTransform: 'capitalize' }}>
                          {tc.id.replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ backgroundColor: color + '20', color, fontWeight: 'bold', padding: '0.3rem 1rem', borderRadius: '50px' }}>
                            {tc.score} pts
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#888' }}>{tc.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── ACTIVITY TIMELINE ────────────────────────────────────────────── */}
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Activity size={28} color="#2196F3" /> {tr('activityLog')}
          </h2>

          {sessionLog.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', fontSize: '1.2rem', padding: '2rem 0' }}>{tr('noActivity')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {sessionLog.slice(0, 20).map((act, i) => {
                const meta = getActionMeta(act.action);
                const Icon = meta.Icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem', backgroundColor: '#FAFAFA', borderRadius: '15px', border: '1px solid #EEE' }}>
                    <div style={{ backgroundColor: meta.color, padding: '0.9rem', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>
                        {meta.label}{act.detail ? `: ${act.detail}` : ''}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <Clock size={13} /> {relativeTime(act.date)}
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
