import { useState, useEffect } from 'react';
import { User, Lock, Volume2, Rocket, Eye, EyeOff, Sparkles, LogOut, LayoutDashboard, BookOpen, Gamepad2, CheckSquare, Menu, X, Users } from 'lucide-react';
import './App.css';
import Lessons from './components/Lessons';
import Dashboard from './components/Dashboard';
import Games from './components/Games';
import Tests from './components/Tests';
import ParentsPortal from './components/ParentsPortal';
import { supabase } from './services/supabaseClient';
import { fetchProgress, updateProgress as apiUpdateProgress, toggleDailyTask as apiToggleTask } from './services/api';
import { t } from './i18n/translations';

function App() {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [isLogin, setIsLogin]           = useState(true);
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError]       = useState('');

  // ── Stored user & progress ─────────────────────────────────────────────────
  const [user, setUser]                 = useState(null);      // { username, password }
  const [progress, setProgress]         = useState(null);      // full progress object

  // ── UI state ───────────────────────────────────────────────────────────────
  const [stars, setStars]               = useState([]);
  const [sweetVoice, setSweetVoice]     = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLaunching, setIsLaunching]   = useState(false);
  const [currentView, setCurrentView]   = useState('dashboard');
  const [speechSpeed, setSpeechSpeed]   = useState('normal');
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [language, setLanguage]         = useState('en');   // 'en' | 'ta'
  // ── Sidebar PIN gate ───────────────────────────────────────────────────────
  const [showSidebarPin, setShowSidebarPin] = useState(false);
  const [sidebarPinInput, setSidebarPinInput] = useState('');
  const [sidebarPinError, setSidebarPinError] = useState('');
  const [sidebarPinMode, setSidebarPinMode]   = useState('entry'); // 'entry' | 'setup' | 'confirm'
  const [sidebarPinConfirm, setSidebarPinConfirm] = useState('');
  const PIN_KEY = 'dys_parent_pin';

  const openSidebarPin = () => {
    const stored = localStorage.getItem(PIN_KEY);
    setSidebarPinInput('');
    setSidebarPinConfirm('');
    setSidebarPinError('');
    setSidebarPinMode(stored ? 'entry' : 'setup');
    setShowSidebarPin(true);
  };
  const closeSidebarPin = () => {
    setShowSidebarPin(false);
    setSidebarPinInput('');
    setSidebarPinConfirm('');
    setSidebarPinError('');
  };

  // ── Bootstrap: check for existing session on mount ─────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUsernameInput(session.user.user_metadata?.username || session.user.email.split('@')[0]);
        doLogin(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        doLogin(session.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    // Generate background decorations
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top:  `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay:    `${Math.random() * 2}s`,
    }));
    setStars(newStars);
    // Voice
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice =
        // 1st: Edge Neural Indian English Female (Neerja) — best quality, free
        voices.find(v => v.name.includes('Neerja')) ||
        // 2nd: Edge Neural Indian English Male (Prabhat)
        voices.find(v => v.name.includes('Prabhat')) ||
        // 3rd: Any en-IN Online/Natural neural voice (Edge)
        voices.find(v => v.lang === 'en-IN' && v.name.includes('Online')) ||
        // 4th: Google Indian English Female (Chrome)
        voices.find(v => v.lang === 'en-IN' && v.name.toLowerCase().includes('female')) ||
        // 5th: Microsoft Heera (Windows Indian female, non-neural)
        voices.find(v => v.name.includes('Heera')) ||
        // 6th: Any en-IN voice
        voices.find(v => v.lang === 'en-IN') ||
        // 7th: Microsoft Ravi (Windows Indian male)
        voices.find(v => v.name.includes('Ravi')) ||
        // 8th: Google UK Female fallback
        voices.find(v => v.name.includes('Google UK English Female')) ||
        // 9th: Windows Zira (US last resort)
        voices.find(v => v.name.includes('Zira'));
      if (voice) {
        setSweetVoice(voice);
        console.log('[TTS] Using voice:', voice.name, voice.lang);
      }
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      setLastSpokenText(text);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (sweetVoice) utterance.voice = sweetVoice;
      utterance.rate  = speechSpeed === 'slow' ? 0.6 : 0.85;
      utterance.pitch = 1.3;
      window.speechSynthesis.speak(utterance);
    }
  };

  const replayAudio = () => { if (lastSpokenText) speakText(lastSpokenText); };

  // ── Persist progress helper ────────────────────────────────────────────────
  // Does an optimistic UI update immediately, then syncs to the Django API.
  const persistProgress = (patch) => {
    const updated = { ...(progress || {}), ...patch };
    setProgress(updated); // Optimistic update
    apiUpdateProgress(patch).catch(err => console.error('Failed to persist progress:', err));
    return updated;
  };

  // ── Login after successful auth ────────────────────────────────────────────
  const doLogin = async (loggedInUser) => {
    setUser({ username: loggedInUser.user_metadata?.username || loggedInUser.email.split('@')[0] });
    setIsLoggedIn(true);
    try {
      const p = await fetchProgress();
      setProgress(p);
    } catch (err) {
      console.error("Failed to load progress from DJango API:", err);
      window.alert("Backend Connection Failed: " + err.message + "\nPlease make sure the Django server is still running on port 8000.");
    }
  };

  // ── Auth submit (Supabase) ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const trimmedUsername = usernameInput.trim();
    const trimmedPassword = passwordInput.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }

    const email = `${trimmedUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}@dyslearn.com`;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: trimmedPassword,
        });
        if (error) throw error;
        speakText('Blast off! Welcome back.');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: trimmedPassword,
          options: { data: { username: trimmedUsername } }
        });
        if (error) throw error;
        speakText('Welcome to the crew! Registration successful.');
      }
      triggerLaunchSequence();
    } catch (err) {
      speakText("Hmm, that code isn't quite right. Try again!");
      setAuthError(err.message || 'Authentication failed.');
    }
  };

  const triggerLaunchSequence = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLaunching(false);
    }, 2500);
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setPasswordInput('');
    setAuthError('');
    setShowPassword(false);
    speakText(isLogin ? "Let's create a new learner profile!" : "Welcome back! Ready to log in?");
  };

  // ── Task toggle (API call) ───────────────────────────────────────────────
  const toggleTask = async (taskId, taskTitle, currentStatus, starsReward) => {
    if (!progress) return;
    
    // Optimistic UI update
    const newTasks = progress.dailyTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    let newProgress = { ...progress, dailyTasks: newTasks };

    if (!currentStatus) {
      const xpEarned = starsReward * 10;
      newProgress.totalXP += xpEarned;
      newProgress.weeklyStars += starsReward;
      speakText(`Great job! You earned ${starsReward} stars for completing: ${taskTitle}`);
    } else {
      speakText(`${taskTitle} needs to be done.`);
    }
    
    setProgress(newProgress);

    // Call API behind the scenes
    try {
      await apiToggleTask(taskId, currentStatus, starsReward);
    } catch (err) {
      console.error(err);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setProgress(null);
    setCurrentView('dashboard');
    speakText('Logging out. See you next time!');
  };

  // ── Language toggle ────────────────────────────────────────────────────────
  const toggleLanguage = () => setLanguage(l => l === 'en' ? 'ta' : 'en');

  // ── Translation shorthand ──────────────────────────────────────────────────
  const tr = (key) => t(language, key);

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: Login / Register
  // ══════════════════════════════════════════════════════════════════════════
  const renderLoginForm = () => {
    return (
      <>
        <div className="stars">
          {stars.map((star) => (
            <div key={star.id} className="star" style={{
              left: star.left, top: star.top, width: star.size, height: star.size,
              animationDuration: star.animationDuration, animationDelay: star.animationDelay,
            }} />
          ))}
        </div>

        {/* Login card */}
        <main className="login-container">
          {/* Brand mark */}
          <div className="rocket-decoration" aria-hidden="true">
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-bright)', letterSpacing: '-0.5px' }}>Dys<span style={{ color: 'var(--accent-primary)' }}>Learn</span></span>
          </div>
          <header className="login-header">
            <h1>{isLogin ? tr('loginTitle') : tr('registerTitle')}</h1>
            <p>{isLogin ? tr('loginSubtitle') : tr('registerSubtitle')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                className="tts-button"
                onClick={() => speakText(isLogin
                  ? "Welcome to Dys-Learn! Ready to explore and learn? Enter your learner name and secret code to begin."
                  : "Join the Crew! Become a new Space Explorer. Create a learner name and a secret code."
                )}
                aria-label="Read welcome message aloud"
                title="Read aloud"
                type="button"
                style={{ padding: '0.8rem' }}
              >
                <Volume2 size={24} />
              </button>
            </div>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <div className="input-label">
                <label htmlFor="username">{tr('learnerName')}</label>
                <button className="tts-button" type="button"
                  onClick={() => speakText('Learner Name. Type your name here.')}
                  aria-label="Read Learner Name aloud"
                  style={{ width: '30px', height: '30px', padding: 0 }}
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <div className="input-field-wrapper">
                <User className="input-icon" size={24} />
                <input
                  id="username"
                  type="text"
                  className="input-field"
                  placeholder={tr('usernamePlaceholder')}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <div className="input-label">
                <label htmlFor="password">{tr('secretCode')}</label>
                <button className="tts-button" type="button"
                  onClick={() => speakText('Secret Code. Type your secret password here.')}
                  aria-label="Read Secret Code aloud"
                  style={{ width: '30px', height: '30px', padding: 0 }}
                >
                  <Volume2 size={16} />
                </button>
              </div>
              <div className="input-field-wrapper">
                <Lock className="input-icon" size={24} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder={tr('passwordPlaceholder')}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', color: 'var(--text-mid)', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {authError && (
              <div role="alert" style={{
                color: '#fca5a5',
                fontWeight: 700,
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                textAlign: 'center',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.35)',
                padding: '0.7rem 1rem',
                borderRadius: '12px',
              }}>
                {authError}
              </div>
            )}

            <button type="submit" className="submit-button">
              <Rocket className="rocket-icon" size={28} />
              {isLogin ? tr('blastOff') : tr('joinCrew')}
            </button>
          </form>

          <footer className="footer-text">
            <div style={{ marginBottom: '1rem' }}>
              {isLogin ? tr('newLearner') + ' ' : tr('haveAccount') + ' '}
              {isLogin && (
                <a href="#" onClick={toggleMode}>{tr('joinLink')}</a>
              )}
              {!isLogin && (
                <a href="#" onClick={toggleMode}>{tr('loginLink')}</a>
              )}
            </div>
            <div>
              {tr('needHelp')} <a href="#" onClick={(e) => { e.preventDefault(); speakText('Ask a grown-up for help!'); }}>{tr('askGrownUp')}</a>
              <Sparkles size={16} color="var(--primary)" style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
            </div>
          </footer>
        </main>
      </>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: Authenticated shell (sidebar + content)
  // ══════════════════════════════════════════════════════════════════════════
  const renderDashboard = () => (
    <div className="dashboard-layout">
      <div className="stars">
        {stars.map((star) => (
          <div key={star.id} className="star" style={{
            left: star.left, top: star.top, width: star.size, height: star.size,
            animationDuration: star.animationDuration, animationDelay: star.animationDelay,
          }} />
        ))}
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Hamburger */}
      <button
        className="menu-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-profile">
          <div className="profile-circle">
            <span className="profile-initial">
              {(user?.username || 'S')[0].toUpperCase()}
            </span>
          </div>
          <div className="profile-name">{user?.username || 'Space Explorer'}</div>
        </div>

        <nav className="sidebar-nav">
          {[
            { view: 'dashboard', icon: <LayoutDashboard size={24} />, label: tr('dashboard') },
            { view: 'lessons',   icon: <BookOpen size={24} />,         label: tr('lessons') },
            { view: 'games',     icon: <Gamepad2 size={24} />,          label: tr('games') },
            { view: 'tests',     icon: <CheckSquare size={24} />,        label: tr('tests') },
          ].map(({ view, icon, label }) => (
            <button
              key={view}
              className={`nav-item ${currentView === view ? 'active' : ''}`}
              onClick={() => { speakText(label); setCurrentView(view); setIsSidebarOpen(false); }}
            >
              {icon}{label}
            </button>
          ))}

          <div className="nav-divider">
            <button
              className={`nav-item ${currentView === 'parents' ? 'active' : ''}`}
              onClick={() => {
                speakText(tr('parentsPortal'));
                setIsSidebarOpen(false);
                openSidebarPin();
              }}
            >
              <Users size={24} />{tr('parentsPortal')}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} />{tr('logOut')}
            </button>
          </div>
        </nav>
      </aside>

      {/* ── Sidebar PIN Gate Modal ─────────────────────────────────────────── */}
      {showSidebarPin && (() => {
        const isSetup   = sidebarPinMode === 'setup';
        const isConfirm = sidebarPinMode === 'confirm';

        const handleSubmit = (e) => {
          e.preventDefault();
          if (isSetup) {
            if (sidebarPinInput.length < 4) { setSidebarPinError('PIN must be 4 digits.'); return; }
            setSidebarPinConfirm(sidebarPinInput);
            setSidebarPinInput('');
            setSidebarPinError('');
            setSidebarPinMode('confirm');
          } else if (isConfirm) {
            if (sidebarPinInput !== sidebarPinConfirm) {
              setSidebarPinError('PINs do not match. Try again.');
              setSidebarPinInput('');
              setSidebarPinConfirm('');
              setSidebarPinMode('setup');
            } else {
              localStorage.setItem(PIN_KEY, sidebarPinInput);
              closeSidebarPin();
              setCurrentView('parents');
            }
          } else {
            const stored = localStorage.getItem(PIN_KEY);
            if (sidebarPinInput === stored) {
              closeSidebarPin();
              setCurrentView('parents');
            } else {
              setSidebarPinError('Wrong PIN. Try again.');
              setSidebarPinInput('');
            }
          }
        };

        const title = isSetup ? '🔐 Create a Parent PIN' : isConfirm ? '✅ Confirm Your PIN' : '🔐 Parents Only';
        const sub   = isSetup ? 'Choose a 4-digit PIN.' : isConfirm ? 'Re-enter to confirm.' : 'Enter your parent PIN.';
        const btn   = isSetup ? 'Set PIN' : isConfirm ? 'Confirm' : 'Unlock';

        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }}>
            <div style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(129,140,248,0.25)', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', maxWidth: '340px', width: '90%' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.4rem' }}>{title}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{sub}</p>
              <form onSubmit={handleSubmit}>
                <input
                  key={sidebarPinMode}
                  type="password" inputMode="numeric" maxLength={4}
                  value={sidebarPinInput}
                  onChange={(e) => { setSidebarPinInput(e.target.value.replace(/[^0-9]/g, '')); setSidebarPinError(''); }}
                  autoFocus placeholder="····"
                  style={{ fontSize: '1.8rem', width: '140px', textAlign: 'center', letterSpacing: '10px', padding: '0.7rem', borderRadius: '12px', border: `1.5px solid ${sidebarPinError ? 'rgba(239,68,68,0.6)' : 'rgba(129,140,248,0.35)'}`, outline: 'none', background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
                {sidebarPinError && <div style={{ color: '#f87171', fontSize: '0.85rem', margin: '0.5rem 0' }}>{sidebarPinError}</div>}
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginTop: '1.2rem' }}>
                  <button type="button" onClick={closeSidebarPin} style={{ padding: '0.6rem 1.4rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#94a3b8', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-main)' }}>Cancel</button>
                  <button type="submit" disabled={sidebarPinInput.length < 4} style={{ padding: '0.6rem 1.4rem', borderRadius: '50px', border: 'none', background: sidebarPinInput.length < 4 ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg,#4f46e5,#818cf8)', color: 'white', fontWeight: 700, cursor: sidebarPinInput.length < 4 ? 'default' : 'pointer', fontFamily: 'var(--font-main)' }}>{btn}</button>
                </div>
              </form>
              {!isSetup && !isConfirm && (
                <button onClick={() => { setSidebarPinInput(''); setSidebarPinError(''); setSidebarPinMode('setup'); }} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                  Forgot PIN? Reset it
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Main content */}
      <main className="dashboard-content" style={{ position: 'relative' }}>
        {/* Floating audio controls */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.8rem', zIndex: 100 }}>
          <button
            onClick={replayAudio}
            className="tts-button"
            style={{ width: 'auto', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            {tr('replay')}
          </button>
          <button
            onClick={() => setSpeechSpeed(s => s === 'normal' ? 'slow' : 'normal')}
            className="tts-button"
            style={{
              width: 'auto', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem',
              backgroundColor: speechSpeed === 'slow' ? '#27AE60' : '#F39C12',
              boxShadow: speechSpeed === 'slow' ? '0 4px 0 #1E8449' : '0 4px 0 #D68910'
            }}
          >
            {speechSpeed === 'slow' ? tr('slowSpeed') : tr('normalSpeed')}
          </button>
        </div>

        {currentView === 'dashboard' && progress && (
          <Dashboard
            username={user?.username}
            progress={progress}
            language={language}
            toggleLanguage={toggleLanguage}
            dailyTasks={progress.dailyTasks}
            setDailyTasks={(tasks) => persistProgress({ dailyTasks: tasks })}
            speakText={speakText}
            setCurrentView={setCurrentView}
            toggleTask={toggleTask}
          />
        )}
        {currentView === 'lessons' && (
          <Lessons
            speakText={speakText}
            speechSpeed={speechSpeed}
            setSpeechSpeed={setSpeechSpeed}
            replayAudio={replayAudio}
            onBack={() => setCurrentView('dashboard')}
            language={language}
            progress={progress}
            persistProgress={persistProgress}
          />
        )}
        {currentView === 'games' && (
          <Games
            speakText={speakText}
            speechSpeed={speechSpeed}
            setSpeechSpeed={setSpeechSpeed}
            replayAudio={replayAudio}
            onBack={() => setCurrentView('dashboard')}
            language={language}
            progress={progress}
            persistProgress={persistProgress}
          />
        )}
        {currentView === 'tests' && (
          <Tests
            speakText={speakText}
            speechSpeed={speechSpeed}
            setSpeechSpeed={setSpeechSpeed}
            replayAudio={replayAudio}
            onBack={() => setCurrentView('dashboard')}
            language={language}
            progress={progress}
            persistProgress={persistProgress}
          />
        )}
        {currentView === 'parents' && (
          <ParentsPortal
            onBack={() => setCurrentView('dashboard')}
            progress={progress}
            language={language}
          />
        )}
      </main>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER: Launch animation
  // ══════════════════════════════════════════════════════════════════════════
  const renderLaunchAnimation = () => (
    <div className="launch-overlay">
      <div className="launch-rocket-center" aria-hidden="true">🚀</div>
      <div className="stars">
        {stars.map((star) => (
          <div key={star.id} className="star" style={{
            left: star.left, top: star.top, width: star.size, height: star.size,
            animationDuration: star.animationDuration, animationDelay: star.animationDelay,
          }} />
        ))}
      </div>
    </div>
  );

  if (isLaunching) return renderLaunchAnimation();
  return isLoggedIn ? renderDashboard() : renderLoginForm();
}

export default App;
