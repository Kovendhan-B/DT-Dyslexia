import { useState, useEffect } from 'react';
import { User, Lock, Volume2, Rocket, Eye, EyeOff, Sparkles, LogOut, LayoutDashboard, BookOpen, Gamepad2, CheckSquare, Menu, X, Users } from 'lucide-react';
import './App.css';
import Lessons from './components/Lessons';
import Dashboard from './components/Dashboard';
import Games from './components/Games';
import Tests from './components/Tests';
import ParentsPortal from './components/ParentsPortal';
import { supabase } from './services/supabaseClient';
import { fetchProgress, toggleDailyTask as apiToggleTask } from './services/api';
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
      const voice = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Female') || v.name.includes('Heera'))) ||
                    voices.find(v => v.lang === 'en-IN') ||
                    voices.find(v => v.name.includes('Google UK English Female')) ||
                    voices.find(v => v.name.includes('Zira'));
      if (voice) setSweetVoice(voice);
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
  const persistProgress = (patch) => {
    const updated = updateProgress(patch);
    setProgress(updated);
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
              onClick={() => { speakText(tr('parentsPortal')); setCurrentView('parents'); setIsSidebarOpen(false); }}
            >
              <Users size={24} />{tr('parentsPortal')}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} />{tr('logOut')}
            </button>
          </div>
        </nav>
      </aside>

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
