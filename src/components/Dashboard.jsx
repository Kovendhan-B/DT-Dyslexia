import { useState, useRef } from 'react';

// ─── Rank helper ──────────────────────────────────────────────
function getRank(completedCount) {
  if (completedCount >= 16) return '🌌 Cosmic Master';
  if (completedCount >= 6)  return '🚀 Galaxy Explorer';
  return '⭐ Star Cadet';
}

// ─── Planet surface emojis based on progress ─────────────────
function PlanetSurface({ completedCount }) {
  if (completedCount === 0) {
    return (
      <>
        <span className="db-planet-emoji" style={{ top: '35%', left: '18%', fontSize: '1.4rem' }}>🌑</span>
        <span className="db-planet-emoji" style={{ top: '55%', left: '58%', fontSize: '1.1rem' }}>🌑</span>
      </>
    );
  }
  if (completedCount <= 5) {
    return (
      <>
        <span className="db-planet-emoji" style={{ top: '28%', left: '22%', fontSize: '1.6rem' }}>🌱</span>
        <span className="db-planet-emoji" style={{ top: '55%', left: '58%', fontSize: '1.3rem' }}>🌱</span>
        <span className="db-planet-emoji" style={{ top: '68%', left: '30%', fontSize: '1rem' }}>🌱</span>
      </>
    );
  }
  if (completedCount <= 15) {
    return (
      <>
        <span className="db-planet-emoji" style={{ top: '20%', left: '20%', fontSize: '1.8rem' }}>🌳</span>
        <span className="db-planet-emoji" style={{ top: '50%', left: '58%', fontSize: '1.8rem' }}>🏠</span>
        <span className="db-planet-emoji" style={{ top: '68%', left: '32%', fontSize: '1.3rem' }}>🌿</span>
      </>
    );
  }
  return (
    <>
      <span className="db-planet-emoji" style={{ top: '18%', left: '18%', fontSize: '1.8rem' }}>🏙️</span>
      <span className="db-planet-emoji" style={{ top: '48%', left: '60%', fontSize: '1.6rem' }}>🌳</span>
      <span className="db-planet-emoji" style={{ top: '65%', left: '28%', fontSize: '1.4rem' }}>🚀</span>
      <span className="db-planet-emoji" style={{ top: '22%', left: '60%', fontSize: '1.2rem' }}>✨</span>
    </>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────
export default function Dashboard({ username, dailyTasks, setDailyTasks, speakText, setCurrentView }) {
  const [language, setLanguage] = useState('english');
  const [burstingTask, setBurstingTask] = useState(null);
  const [lockedTooltip, setLockedTooltip] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const burstTimeoutRef = useRef(null);

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
      speakText('Incorrect PIN.');
    }
  };

  const completedCount = dailyTasks.filter(t => t.completed).length;
  const totalTasks = dailyTasks.length;
  const questProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Planet level logic (per task-completion buckets)
  let planetLevel = 1;
  if (completedCount >= 6) planetLevel = 2;
  if (completedCount >= 16) planetLevel = 3;
  const planetMaxForLevel = planetLevel === 1 ? 5 : planetLevel === 2 ? 15 : 25;
  const planetProgress = Math.min(
    ((completedCount - (planetLevel === 1 ? 0 : planetLevel === 2 ? 5 : 15)) /
      (planetMaxForLevel - (planetLevel === 1 ? 0 : planetLevel === 2 ? 5 : 15))) * 100,
    100
  );

  // ─── Task toggle with burst animation ──────────────────────
  const handleTaskToggle = (task) => {
    if (!task.completed) {
      setBurstingTask(task.id);
      clearTimeout(burstTimeoutRef.current);
      burstTimeoutRef.current = setTimeout(() => setBurstingTask(null), 900);
      speakText(`Great job! You earned ${task.starsReward} XP for completing ${task.title}`);
    } else {
      speakText(`${task.title} needs to be done.`);
    }
    setDailyTasks(tasks =>
      tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
    );
  };

  // ─── Alphabet and Number tile data ─────────────────────────
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const numbers = Array.from({ length: 10 }, (_, i) => String(i + 1));
  const UNLOCKED_ALPHA = 3;
  const UNLOCKED_NUMS = 2;

  // ─── Portal definitions ─────────────────────────────────────
  const portals = [
    {
      id: 'lessons',
      emoji: '📚',
      title: 'Lessons',
      status: 'Active',
      active: true,
      onClick: () => setCurrentView('lessons'),
    },
    {
      id: 'games',
      emoji: '🎮',
      title: 'Games',
      status: 'Active',
      active: true,
      onClick: () => setCurrentView('games'),
    },
    {
      id: 'tests',
      emoji: '📝',
      title: 'Tests',
      status: 'Active',
      active: true,
      onClick: () => setCurrentView('tests'),
      tooltip: 'Evaluate what you learned! 🚀',
    },
    {
      id: 'parents',
      emoji: '👨‍👩‍👧',
      title: 'Parents Portal',
      status: 'Active',
      active: true,
      onClick: () => setShowPinModal(true),
      tooltip: 'Track Progress & Settings 🔑',
      isParents: true,
    },
  ];

  return (
    <div className="db-root">
      
      {/* PIN Modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '4px solid #F44336' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
            <h2 style={{ fontSize: '2.5rem', color: '#D32F2F', margin: '0 0 1rem 0' }}>Parents Only</h2>
            <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.2rem' }}>Please enter the PIN to continue.<br/>(Hint: 1234)</p>
            <form onSubmit={handlePinSubmit}>
              <input 
                type="password" 
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
                style={{ fontSize: '3rem', width: '200px', textAlign: 'center', letterSpacing: '15px', padding: '1rem', borderRadius: '20px', border: `4px solid ${pinError ? '#F44336' : '#E0E0E0'}`, marginBottom: '1rem', outline: 'none', background: '#FAFAFA' }}
              />
              {pinError && <div style={{ color: '#F44336', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.1rem' }}>Incorrect PIN. Try again.</div>}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button type="button" onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(false); }} style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', backgroundColor: '#E0E0E0', color: '#666', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', backgroundColor: '#F44336', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(244,67,54,0.3)' }}>Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          ZONE 1 — Identity Bar
      ═══════════════════════════════════════════ */}
      <div className="db-identity-bar">
        {/* Avatar */}
        <div className="db-avatar-wrap">
          <div className="db-avatar-ring">
            <span className="db-avatar-emoji">🧑‍🚀</span>
          </div>
          <div className="db-avatar-info">
            <div className="db-username">{username || 'Space Explorer'}</div>
            <div className="db-rank">{getRank(completedCount)}</div>
          </div>
        </div>

        {/* Streak + Language */}
        <div className="db-identity-right">
          <div className="db-streak-badge">🔥 Day Streak: 1</div>

          {/* Language Toggle */}
          <button
            className="db-lang-pill"
            onClick={() => setLanguage(l => l === 'english' ? 'tamil' : 'english')}
            aria-label="Toggle language"
          >
            <span className={`db-lang-indicator ${language === 'english' ? 'db-lang-left' : 'db-lang-right'}`} />
            <span className={`db-lang-option ${language === 'english' ? 'db-lang-active-text' : ''}`}>EN</span>
            <span className={`db-lang-option ${language === 'tamil' ? 'db-lang-active-text' : ''}`}>தமிழ்</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          ZONE 2 — Hero Planet
      ═══════════════════════════════════════════ */}
      <div className="db-hero">
        <div className="db-planet-wrap">
          <div className="db-orbit-ring" />
          <div className="db-planet">
            <PlanetSurface completedCount={completedCount} />
          </div>
        </div>
        <div className="db-planet-label">🌍 Planet Level: {planetLevel}</div>
        <div className="db-planet-progress-wrap">
          <div className="db-planet-progress-bar">
            <div className="db-planet-progress-fill" style={{ width: `${planetProgress}%` }} />
          </div>
          <span className="db-planet-progress-text">{Math.round(planetProgress)}% to next level</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          ZONE 3 — Side Panels
      ═══════════════════════════════════════════ */}
      <div className="db-panels">

        {/* LEFT — Today's Quests */}
        <div className="db-panel db-panel-quests">
          <div className="db-panel-header">⚔️ Today's Quests</div>
          <div className="db-quest-list">
            {dailyTasks.map(task => (
              <div
                key={task.id}
                className={`db-quest-item ${task.completed ? 'db-quest-done' : ''}`}
                onClick={() => handleTaskToggle(task)}
              >
                {/* Checkbox area with burst */}
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
                <span className="db-xp-badge">+{task.starsReward * 10} XP</span>
              </div>
            ))}
          </div>
          {/* Quest summary */}
          <div className="db-quest-footer">
            <div className="db-quest-summary">
              🎯 {completedCount} / {totalTasks} Quests Done
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
          <div className="db-panel-header">🏆 Progress Vault</div>

          {/* Alphabet Grid */}
          <div className="db-vault-section-label">📖 Alphabets</div>
          <div className="db-alpha-grid">
            {alphabet.map((letter, i) => {
              const unlocked = i < UNLOCKED_ALPHA;
              return (
                <div
                  key={letter}
                  className={`db-tile ${unlocked ? 'db-tile-unlocked' : 'db-tile-locked'}`}
                  onMouseEnter={() => unlocked && speakText(letter)}
                  onClick={() => unlocked && speakText(letter)}
                  title={unlocked ? letter : 'Locked'}
                >
                  {unlocked ? letter : '🔒'}
                </div>
              );
            })}
          </div>

          {/* Number Grid */}
          <div className="db-vault-section-label" style={{ marginTop: '1rem' }}>🔢 Numbers</div>
          <div className="db-number-grid">
            {numbers.map((num, i) => {
              const unlocked = i < UNLOCKED_NUMS;
              return (
                <div
                  key={num}
                  className={`db-tile ${unlocked ? 'db-tile-unlocked' : 'db-tile-locked'}`}
                  onMouseEnter={() => unlocked && speakText(num)}
                  onClick={() => unlocked && speakText(num)}
                  title={unlocked ? num : 'Locked'}
                >
                  {unlocked ? num : '🔒'}
                </div>
              );
            })}
          </div>

          {/* Stars collected */}
          <div className="db-vault-stars">⭐ Stars Collected This Week: <strong>⭐ × 12</strong></div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          ZONE 4 — Navigation Portals
      ═══════════════════════════════════════════ */}
      <div className="db-portals">
        {portals.map(portal => (
          <div
            key={portal.id}
            className={`db-portal-card ${portal.active ? 'db-portal-active' : 'db-portal-locked'} ${portal.isParents ? 'db-portal-parents' : ''}`}
            onClick={() => {
              if (portal.active && portal.onClick) {
                portal.onClick();
              } else if (!portal.active) {
                setLockedTooltip(lockedTooltip === portal.id ? null : portal.id);
              }
            }}
            onMouseEnter={() => !portal.active && setLockedTooltip(portal.id)}
            onMouseLeave={() => setLockedTooltip(null)}
          >
            {/* Locked overlay */}
            {!portal.active && (
              <div className="db-portal-lock-overlay">🔒</div>
            )}

            <div className="db-portal-emoji">{portal.emoji}</div>
            <div className="db-portal-title">{portal.title}</div>
            <div className={`db-portal-status ${portal.active ? 'db-status-active' : 'db-status-soon'}`}>
              {portal.active ? '● Active' : '◎ Coming Soon'}
            </div>
            {portal.active && <div className="db-portal-cta">Tap to Enter</div>}

            {/* Tooltip for locked */}
            {!portal.active && lockedTooltip === portal.id && (
              <div className="db-portal-tooltip">{portal.tooltip}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
