import { useState, useRef } from 'react';
import { t } from '../i18n/translations';

// ─── Rank helper ────────────────────────────────────────────────────────────
function getRank(completedCount, lang) {
  if (completedCount >= 16) return t(lang, 'rankMaster');
  if (completedCount >= 6)  return t(lang, 'rankExplorer');
  return t(lang, 'rankCadet');
}

// ─── XP Donut Ring ──────────────────────────────────────────────────────────
function XPRing({ totalXP, planetLevel, planetProgress }) {
  const R = 76;                       // radius (viewBox 180 = 180/2 - 14/2)
  const C = 2 * Math.PI * R;         // circumference
  const offset = C - (planetProgress / 100) * C;
  return (
    <div className="db-ring-wrap">
      <svg className="db-ring-svg" viewBox="0 0 180 180" aria-hidden="true">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
        <circle className="db-ring-track" cx="90" cy="90" r={R} />
        <circle
          className="db-ring-fill"
          cx="90" cy="90" r={R}
          strokeDasharray={C}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="db-ring-center">
        <div className="db-ring-xp">{totalXP}</div>
        <div className="db-ring-label">XP</div>
        <div className="db-ring-level">Lv {planetLevel}</div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────
export default function Dashboard({
  username, progress, language, toggleLanguage,
  dailyTasks, setDailyTasks, speakText, setCurrentView, toggleTask,
}) {
  const [burstingTask, setBurstingTask] = useState(null);
  const [lockedTooltip, setLockedTooltip] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const burstTimeoutRef = useRef(null);

  const tr = (key) => t(language, key);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      setCurrentView('parents');
    } else {
      setPinError(true);
      setPinInput('');
      speakText(tr('incorrectPin'));
    }
  };

  // ── Real data from progress ─────────────────────────────────────────────
  const completedCount  = dailyTasks.filter(t => t.completed).length;
  const totalTasks      = dailyTasks.length;
  const questProgress   = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const streakCount     = progress?.streak?.count ?? 0;
  const weeklyStars     = progress?.weeklyStars ?? 0;
  const unlockedAlpha   = progress?.unlockedAlpha ?? 0;
  const unlockedNums    = progress?.unlockedNum ?? 0;

  // Planet level logic
  let planetLevel = 1;
  if (completedCount >= 6)  planetLevel = 2;
  if (completedCount >= 16) planetLevel = 3;
  const planetBase     = planetLevel === 1 ? 0 : planetLevel === 2 ? 5 : 15;
  const planetMax      = planetLevel === 1 ? 5 : planetLevel === 2 ? 15 : 25;
  const planetProgress = Math.min(((completedCount - planetBase) / (planetMax - planetBase)) * 100, 100);

  // ── Task toggle with burst animation ───────────────────────────────────
  const handleTaskToggle = (task) => {
    if (!task.completed) {
      setBurstingTask(task.id);
      clearTimeout(burstTimeoutRef.current);
      burstTimeoutRef.current = setTimeout(() => setBurstingTask(null), 900);
    }
    toggleTask(task.id, task.title, task.completed, task.starsReward);
  };

  // ── Alphabet and Number tile data ───────────────────────────────────────
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers  = Array.from({ length: 10 }, (_, i) => String(i + 1));

  // ── Portal definitions ──────────────────────────────────────────────────
  const portals = [
    { id: 'lessons', emoji: '📚', titleKey: 'lessons',       active: true, onClick: () => setCurrentView('lessons') },
    { id: 'games',   emoji: '🎮', titleKey: 'games',         active: true, onClick: () => setCurrentView('games') },
    { id: 'tests',   emoji: '📝', titleKey: 'tests',         active: true, onClick: () => setCurrentView('tests') },
    { id: 'parents', emoji: '👨‍👩‍👧', titleKey: 'parentsPortal', active: true, onClick: () => setShowPinModal(true), isParents: true },
  ];

  return (
    <div className="db-root">

      {/* PIN Modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(129,140,248,0.2)', padding: '3rem', borderRadius: '28px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', maxWidth: '360px', width: '90%' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.5rem 0' }}>{tr('parentsOnly')}</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1rem' }}>{tr('pinInstruction')}</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
                style={{ fontSize: '2rem', width: '160px', textAlign: 'center', letterSpacing: '12px', padding: '0.8rem', borderRadius: '14px', border: `1.5px solid ${pinError ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.12)'}`, marginBottom: '0.5rem', outline: 'none', background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', boxSizing: 'border-box' }}
              />
              {pinError && <div style={{ color: '#f87171', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>{tr('incorrectPin')}</div>}
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(false); }} style={{ padding: '0.75rem 1.8rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#94a3b8', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-main)' }}>{tr('cancel')}</button>
                <button type="submit" style={{ padding: '0.75rem 1.8rem', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#4f46e5,#818cf8)', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.4)', fontFamily: 'var(--font-main)' }}>{tr('unlock')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ ZONE 1 — Identity Bar ══════════════════════════════════════════ */}
      <div className="db-identity-bar">
        <div className="db-avatar-wrap">
          <div className="db-avatar-ring">
            <span className="db-avatar-emoji">🧑‍🚀</span>
          </div>
          <div className="db-avatar-info">
            <div className="db-username">{username || 'Space Explorer'}</div>
            <div className="db-rank">{getRank(completedCount, language)}</div>
          </div>
        </div>

        <div className="db-identity-right">
          <div className="db-streak-badge">{tr('dayStreak')}: {streakCount}</div>
          <button
            className="db-lang-pill"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <span className={`db-lang-indicator ${language === 'en' ? 'db-lang-left' : 'db-lang-right'}`} />
            <span className={`db-lang-option ${language === 'en' ? 'db-lang-active-text' : ''}`}>EN</span>
            <span className={`db-lang-option ${language === 'ta' ? 'db-lang-active-text' : ''}`}>தமிழ்</span>
          </button>
        </div>
      </div>

      {/* ═══ ZONE 2 — XP Ring ════════════════════════════════════════════════ */}
      <div className="db-hero">
        <XPRing totalXP={progress?.totalXP ?? 0} planetLevel={planetLevel} planetProgress={planetProgress} />
        <div className="db-planet-progress-wrap">
          <div className="db-planet-progress-bar">
            <div className="db-planet-progress-fill" style={{ width: `${planetProgress}%` }} />
          </div>
          <span className="db-planet-progress-text">{Math.round(planetProgress)}{tr('toNextLevel')}</span>
        </div>
      </div>

      {/* ═══ ZONE 3 — Side Panels ═══════════════════════════════════════════ */}
      <div className="db-panels">

        {/* LEFT — Today's Quests */}
        <div className="db-panel db-panel-quests">
          <div className="db-panel-header">{tr('todaysQuests')}</div>
          <div className="db-quest-list">
            {dailyTasks.map(task => (
              <div
                key={task.id}
                className={`db-quest-item ${task.completed ? 'db-quest-done' : ''}`}
                onClick={() => handleTaskToggle(task)}
              >
                <div className="db-quest-check-wrap">
                  <div className={`db-quest-check ${task.completed ? 'db-check-done' : ''}`}>
                    {task.completed ? (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="10" fill="rgba(129,140,248,0.9)" />
                        <polyline points="6,11 10,15 16,8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                      </svg>
                    )}
                  </div>
                  {burstingTask === task.id && (
                    <div className="db-burst-container" aria-hidden="true">
                      {['✨','⭐','✨','🌟','✨'].map((s, i) => (
                        <span key={i} className={`db-burst-star db-burst-${i}`}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="db-quest-text">{task.title}</span>
                <span className="db-xp-badge">+{task.starsReward * 10} {tr('xpSuffix')}</span>
              </div>
            ))}
          </div>
          <div className="db-quest-footer">
            <div className="db-quest-summary">
              🎯 {completedCount} / {totalTasks} {tr('questsDone')}
            </div>
            <div className="db-quest-progress-wrap">
              <div className="db-quest-progress-bar">
                <div className="db-quest-progress-fill" style={{ width: `${questProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Progress Vault */}
        <div className="db-panel db-panel-vault">
          <div className="db-panel-header">{tr('progressVault')}</div>

          <div className="db-vault-section-label">{tr('alphabetsLabel')}</div>
          <div className="db-alpha-grid">
            {alphabet.map((letter, i) => {
              const unlocked = i <= unlockedAlpha;
              return (
                <div
                  key={letter}
                  className={`db-tile ${unlocked ? 'db-tile-unlocked' : 'db-tile-locked'}`}
                  onMouseEnter={() => unlocked && speakText(letter)}
                  onClick={() => unlocked && speakText(letter)}
                  title={unlocked ? letter : tr('locked')}
                >
                  {unlocked ? letter : '🔒'}
                </div>
              );
            })}
          </div>

          <div className="db-vault-section-label" style={{ marginTop: '1rem' }}>{tr('numbersLabel')}</div>
          <div className="db-number-grid">
            {numbers.map((num, i) => {
              const unlocked = i <= unlockedNums;
              return (
                <div
                  key={num}
                  className={`db-tile ${unlocked ? 'db-tile-unlocked' : 'db-tile-locked'}`}
                  onMouseEnter={() => unlocked && speakText(num)}
                  onClick={() => unlocked && speakText(num)}
                  title={unlocked ? num : tr('locked')}
                >
                  {unlocked ? num : '🔒'}
                </div>
              );
            })}
          </div>

          <div className="db-vault-stars">
            {tr('starsThisWeek')}: <strong>⭐ × {weeklyStars}</strong>
          </div>
        </div>
      </div>

      {/* ═══ ZONE 4 — Navigation Portals ════════════════════════════════════ */}
      <div className="db-portals">
        {portals.map(portal => (
          <div
            key={portal.id}
            className={`db-portal-card db-portal-active ${portal.isParents ? 'db-portal-parents' : ''}`}
            onClick={() => portal.onClick()}
            onMouseLeave={() => setLockedTooltip(null)}
          >
            <div className="db-portal-emoji">{portal.emoji}</div>
            <div className="db-portal-title">{tr(portal.titleKey)}</div>
            <div className="db-portal-status db-status-active">{tr('active')}</div>
            <div className="db-portal-cta">{tr('tapToEnter')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
