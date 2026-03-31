import { useState, useEffect } from 'react';
import { User, Lock, Volume2, Rocket, Eye, EyeOff, Sparkles, LogOut, LayoutDashboard, BookOpen, Gamepad2, CheckSquare, Menu, X, Star, CheckCircle, Circle, Target, Users } from 'lucide-react';
import './App.css';
import Lessons from './components/Lessons';
import Dashboard from './components/Dashboard';
import Games from './components/Games';
import Tests from './components/Tests';
import ParentsPortal from './components/ParentsPortal';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stars, setStars] = useState([]);
  const [rockets, setRockets] = useState([]);
  const [sweetVoice, setSweetVoice] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [speechSpeed, setSpeechSpeed] = useState('normal');
  const [lastSpokenText, setLastSpokenText] = useState('');
  
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "Play 1 Alphabet Game", completed: false, starsReward: 3 },
    { id: 2, title: "Count 10 Stars", completed: false, starsReward: 2 },
    { id: 3, title: "Read your first word", completed: false, starsReward: 5 }
  ]);

  useEffect(() => {
    // Generate random stars for the background
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setStars(newStars);

    // Generate random rockets for the background
    const newRockets = Array.from({ length: 6 }).map((_, i) => ({
      id: `rocket-${i}`,
      left: `${(Math.random() * 60) - 20}vw`, // Start somewhat offscreen left or center
      top: `${(Math.random() * 80) + 20}vh`, // Start somewhat lower down
      size: `${Math.random() * 2 + 3}rem`, // Random sizes between 3rem and 5rem
      animationDuration: `${Math.random() * 20 + 15}s`, // Between 15s and 35s to cross screen
      animationDelay: `${Math.random() * 25}s`, // Stagger their start times up to 25s
    }));
    setRockets(newRockets);

    // Try to find a sweeter/female child-friendly voice
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Female') || v.name.includes('Heera'))) || 
                    voices.find(v => v.lang === 'en-IN') ||
                    voices.find(v => v.name.includes('Google UK English Female')) ||
                    voices.find(v => v.name.includes('Zira'));
      if (voice) setSweetVoice(voice);
    };

    // Load voices immediately if available, or wait for the voiceschanged event
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
  }, []);

  // Text-To-Speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      setLastSpokenText(text);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (sweetVoice) {
        utterance.voice = sweetVoice;
      }

      utterance.rate = speechSpeed === 'slow' ? 0.6 : 0.85; // Slower speed
      utterance.pitch = 1.3; // Slightly less high pitch for a natural friendly teacher
      window.speechSynthesis.speak(utterance);
    }
  };

  const replayAudio = () => {
    if (lastSpokenText) {
      speakText(lastSpokenText);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (username === 'admin' && password === 'admin') {
        speakText("Blast off! Welcome to your dashboard.");
        triggerLaunchSequence();
      } else {
        speakText("Hmm, that code isn't quite right. Try again!");
      }
    } else {
      speakText("Welcome to the crew! Registration successful.");
      triggerLaunchSequence();
    }
  };

  const triggerLaunchSequence = () => {
    setIsLaunching(true);
    // Wait for the animation to finish (2.5s) before showing dashboard
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLaunching(false);
    }, 2500); 
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setShowPassword(false);
    if (isLogin) {
      // Switching to register
      speakText("Let's create a new learner profile!");
    } else {
      // Switching to login
      speakText("Welcome back! Ready to log in?");
    }
  };

  const toggleTask = (taskId, taskTitle, currentStatus, starsReward) => {
    setDailyTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    
    if (!currentStatus) {
      speakText(`Great job! You earned ${starsReward} stars for completing: ${taskTitle}`);
    } else {
      speakText(`${taskTitle} needs to be done.`);
    }
  };

  const renderLoginForm = () => (
    <>
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
      
      {rockets.map((rocket) => (
        <div 
          key={rocket.id} 
          className="flying-rocket" 
          aria-hidden="true"
          style={{
            left: rocket.left,
            top: rocket.top,
            fontSize: rocket.size,
            animationDuration: rocket.animationDuration,
            animationDelay: rocket.animationDelay
          }}
        >
          🚀
        </div>
      ))}

      <main className="login-container">
        <div className="rocket-decoration">🚀</div>
        
        <header className="login-header">
          <h1>{isLogin ? "Dys-Learn" : "Join the Crew"}</h1>
          <p>{isLogin ? "Ready to explore and learn?" : "Become a new Space Explorer!"}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              className="tts-button" 
              onClick={() => speakText(
                isLogin 
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
              <label htmlFor="username">Learner Name</label>
              <button 
                className="tts-button"
                type="button"
                onClick={() => speakText("Learner Name. Type your name here.")}
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
                placeholder="admin" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <div className="input-label">
              <label htmlFor="password">Secret Code (Password)</label>
              <button 
                className="tts-button"
                type="button"
                onClick={() => speakText("Secret Code. Type your secret password here.")}
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
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="admin" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  background: 'none', 
                  border: 'none',
                  color: 'var(--secondary)',
                  cursor: 'pointer'
                }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button">
            <Rocket className="rocket-icon" size={28} />
            {isLogin ? "BLAST OFF!" : "JOIN CREW!"}
          </button>
        </form>

        <footer className="footer-text">
          <div style={{ marginBottom: '1rem' }}>
            {isLogin ? "New learner? " : "Already have an account? "}
            <a href="#" onClick={toggleMode}>
              {isLogin ? "Join the crew!" : "Log in here!"}
            </a>
          </div>
          <div>
            Need help? <a href="#" onClick={(e) => { e.preventDefault(); speakText("Ask a grown-up for help!"); }}>Ask a grown-up!</a>
            <Sparkles size={16} color="var(--primary)" style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
          </div>
        </footer>
      </main>
    </>
  );

  const renderDashboard = () => (
    <div className="dashboard-layout">
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Sidebar Overlay for mobile/clicking outside */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Hamburger Menu Button */}
      <button 
        className="menu-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-profile">
          <div className="profile-circle">
            <span className="profile-initial">
              {(username || 'S')[0].toUpperCase()}
            </span>
          </div>
          <div className="profile-name">
            {username || 'Space Explorer'}
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} 
            onClick={() => { speakText("Dashboard"); setCurrentView('dashboard'); setIsSidebarOpen(false); }}
          >
            <LayoutDashboard size={24} />
            Dashboard
          </button>

          <button 
            className={`nav-item ${currentView === 'lessons' ? 'active' : ''}`} 
            onClick={() => { speakText("Lessons"); setCurrentView('lessons'); setIsSidebarOpen(false); }}
          >
            <BookOpen size={24} />
            Lessons
          </button>
          
          <button 
            className={`nav-item ${currentView === 'games' ? 'active' : ''}`} 
            onClick={() => { speakText("Games"); setCurrentView('games'); setIsSidebarOpen(false); }}
          >
            <Gamepad2 size={24} />
            Games
          </button>
          
          <button 
            className={`nav-item ${currentView === 'tests' ? 'active' : ''}`} 
            onClick={() => { speakText("Tests"); setCurrentView('tests'); setIsSidebarOpen(false); }}
          >
            <CheckSquare size={24} />
            Tests
          </button>

          <div className="nav-divider">
            <button 
              className={`nav-item ${currentView === 'parents' ? 'active' : ''}`} 
              onClick={() => { speakText("Parents Portal."); setCurrentView('parents'); setIsSidebarOpen(false); }}
            >
              <Users size={24} />
              Parents Portal
            </button>

            <button 
              className="logout-button" 
              onClick={() => {
                setIsLoggedIn(false);
                speakText("Logging out. See you next time!");
              }}
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </nav>
      </aside>

      <main className="dashboard-content" style={{ position: 'relative' }}>
        {/* Floating Audio Controls */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.8rem', zIndex: 100 }}>
          <button 
            onClick={replayAudio} 
            className="tts-button" 
            style={{ width: 'auto', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            🔄 Replay
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
            {speechSpeed === 'slow' ? '🐢 Slow Speed' : '🐇 Normal Speed'}
          </button>
        </div>

        {currentView === 'dashboard' && (
          <Dashboard
            username={username}
            dailyTasks={dailyTasks}
            setDailyTasks={setDailyTasks}
            speakText={speakText}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'lessons' && <Lessons speakText={speakText} speechSpeed={speechSpeed} setSpeechSpeed={setSpeechSpeed} replayAudio={replayAudio} onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'games' && <Games speakText={speakText} speechSpeed={speechSpeed} setSpeechSpeed={setSpeechSpeed} replayAudio={replayAudio} onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'tests' && <Tests speakText={speakText} speechSpeed={speechSpeed} setSpeechSpeed={setSpeechSpeed} replayAudio={replayAudio} onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'parents' && <ParentsPortal onBack={() => setCurrentView('dashboard')} />}


      </main>
    </div>
  );

  const renderLaunchAnimation = () => (
    <div className="launch-overlay">
      <div className="launch-rocket-center" aria-hidden="true">
        🚀
      </div>
      {/* Continuing to render the stars in the background looks cool */}
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
    </div>
  );

  if (isLaunching) {
    return renderLaunchAnimation();
  }

  return isLoggedIn ? renderDashboard() : renderLoginForm();
}

export default App;
