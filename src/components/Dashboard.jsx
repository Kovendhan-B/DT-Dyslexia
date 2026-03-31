import { useState, useRef } from 'react';
import { t } from '../i18n/translations';

// ─── Rank helper ────────────────────────────────────────────────────────────
function getRank(completedCount, lang) {
  if (completedCount >= 16) return t(lang, 'rankMaster');
  if (completedCount >= 6)  return t(lang, 'rankExplorer');
  return t(lang, 'rankCadet');
}

// ─── Planet surface emojis based on progress ────────────────────────────────
function PlanetSurface({ completedCount }) {
  if (completedCount === 0) return (
    <>
      <span className="db-planet-emoji" style={{ top: '35%', left: '18%', fontSize: '1.4rem' }}>🌑</span>
      <span className="db-planet-emoji" style={{ top: '55%', left: '58%', fontSize: '1.1rem' }}>🌑</span>
    </>
  );
  if (completedCount <= 5) return (
    <>
      <span className="db-planet-emoji" style={{ top: '28%', left: '22%', fontSize: '1.6rem' }}>🌱</span>
      <span className="db-planet-emoji" style={{ top: '55%', left: '58%', fontSize: '1.3rem' }}>🌱</span>
      <span className="db-planet-emoji" style={{ top: '68%', left: '30%', fontSize: '1rem' }}>🌱</span>
    </>
  );
  if (completedCount <= 15) return (
    <>
      <span className="db-planet-emoji" style={{ top: '20%', left: '20%', fontSize: '1.8rem' }}>🌳</span>
      <span className="db-planet-emoji" style={{ top: '50%', left: '58%', fontSize: '1.8rem' }}>🏠</span>
      <span className="db-planet-emoji" style={{ top: '68%', left: '32%', fontSize: '1.3rem' }}>🌿</span>
    </>
  );
  return (
    <>
      <span className="db-planet-emoji" style={{ top: '18%', left: '18%', fontSize: '1.8rem' }}>🏙️</span>
      <span className="db-planet-emoji" style={{ top: '48%', left: '60%', fontSize: '1.6rem' }}>🌳</span>
      <span className="db-planet-emoji" style={{ top: '65%', left: '28%', fontSize: '1.4rem' }}>🚀</span>
      <span className="db-planet-emoji" style={{ top: '22%', left: '60%', fontSize: '1.2rem' }}>✨</span>
    </>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '4px solid #F44336' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontSize: '2.5rem', color: '#D32F2F', margin: '0 0 1rem 0' }}>{tr('parentsOnly')}</h2>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.2rem' }}>{tr('pinInstruction')}</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
                style={{ fontSize: '3rem', width: '200px', textAlign: 'center', letterSpacing: '15px', padding: '1rem', borderRadius: '20px', border: `4px solid ${pinError ? '#F44336' : '#E0E0E0'}`, marginBottom: '1rem', outline: 'none', background: '#FAFAFA' }}
              />
              {pinError && <div style={{ color: '#F44336', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>{tr('incorrectPin')}</div>}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button type="button" onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(false); }} style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', backgroundColor: '#E0E0E0', color: '#666', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>{tr('cancel')}</button>
                <button type="submit" style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', backgroundColor: '#F44336', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(244,67,54,0.3)' }}>{tr('unlock')}</button>
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

      {/* ═══ ZONE 2 — Hero Planet ═══════════════════════════════════════════ */}
      <div className="db-hero">
        <div className="db-planet-wrap">
          <div className="db-orbit-ring" />
          <div className="db-planet">
            <PlanetSurface completedCount={completedCount} />
          </div>
        </div>
        <div className="db-planet-label">{tr('planetLevel')}: {planetLevel}</div>
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
                    {task.completed ? '✅' : '○'}
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
