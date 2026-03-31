import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Star, Lock } from 'lucide-react';

// Placeholders for future test components
import AlphabetTest from './tests/AlphabetTest';
import PhonicsTest from './tests/PhonicsTest';
import SimpleWordsTest from './tests/SimpleWordsTest';
import SightWordsTest from './tests/SightWordsTest';
import WordBuildingTest from './tests/WordBuildingTest';
import SentenceTest from './tests/SentenceTest';
import ReadingComprehensionTest from './tests/ReadingComprehensionTest';

const TEST_CATEGORIES = [
  { id: 'alphabet', emoji: '🔠', title: 'Alphabet Test', desc: 'Identify & Match Letters', color: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50, #81C784)' },
  { id: 'phonics', emoji: '🗣️', title: 'Phonics Test', desc: 'Match Sounds to Letters', color: '#F44336', gradient: 'linear-gradient(135deg, #F44336, #E57373)' },
  { id: 'simplewords', emoji: '🍎', title: 'Simple Words', desc: 'Identify words from images', color: '#2196F3', gradient: 'linear-gradient(135deg, #2196F3, #64B5F6)' },
  { id: 'sightwords', emoji: '👁️', title: 'Sight Words', desc: 'Recognize common words', color: '#9C27B0', gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
  { id: 'wordbuilding', emoji: '🏗️', title: 'Word Building', desc: 'Unscramble mixed letters', color: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
  { id: 'sentence', emoji: '🧩', title: 'Sentences', desc: 'Arrange words correctly', color: '#00BCD4', gradient: 'linear-gradient(135deg, #00BCD4, #4DD0E1)' },
  { id: 'reading', emoji: '📖', title: 'Reading', desc: 'Read and answer!', color: '#E91E63', gradient: 'linear-gradient(135deg, #E91E63, #F06292)' },
];

export default function Tests({ speakText, onBack, speechSpeed }) {
  const [activeTest, setActiveTest] = useState(null);
  
  // Progress tracking locally
  const [completedTests, setCompletedTests] = useState([]);
  const [score, setScore] = useState(0);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('dyslexia_test_progress');
    const savedScore = localStorage.getItem('dyslexia_test_score');
    if (saved) setCompletedTests(JSON.parse(saved));
    if (savedScore) setScore(parseInt(savedScore, 10));
  }, []);

  const saveProgress = (newTests, newScore) => {
    setCompletedTests(newTests);
    setScore(newScore);
    localStorage.setItem('dyslexia_test_progress', JSON.stringify(newTests));
    localStorage.setItem('dyslexia_test_score', newScore.toString());
  };

  const handleSelectTest = (test) => {
    setActiveTest(test.id);
    speakText(`Let's start the ${test.title}!`);
  };

  const handleTestComplete = (testId, pointsEarned) => {
    if (!completedTests.includes(testId)) {
      const newTests = [...completedTests, testId];
      saveProgress(newTests, score + pointsEarned);
    } else {
      saveProgress(completedTests, score + pointsEarned); // replay bonus
    }
    setActiveTest(null);
  };

  /* ─────────────────────────────────────────────
     RENDER TEST MODULES
  ───────────────────────────────────────────── */
  if (activeTest === 'alphabet') return <AlphabetTest speakText={speakText} onComplete={(pts) => handleTestComplete('alphabet', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'phonics') return <PhonicsTest speakText={speakText} onComplete={(pts) => handleTestComplete('phonics', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'simplewords') return <SimpleWordsTest speakText={speakText} onComplete={(pts) => handleTestComplete('simplewords', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'sightwords') return <SightWordsTest speakText={speakText} onComplete={(pts) => handleTestComplete('sightwords', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'wordbuilding') return <WordBuildingTest speakText={speakText} onComplete={(pts) => handleTestComplete('wordbuilding', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'sentence') return <SentenceTest speakText={speakText} onComplete={(pts) => handleTestComplete('sentence', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'reading') return <ReadingComprehensionTest speakText={speakText} onComplete={(pts) => handleTestComplete('reading', pts)} onBack={() => setActiveTest(null)} />;

  /* ─────────────────────────────────────────────
     MAIN HUB RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="ls-root" style={{ minHeight: '100vh', backgroundColor: '#FFF5E1', paddingBottom: '3rem' }}>
      
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FF9800, #FFC107)', padding: '2rem',
        borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
        boxShadow: '0 8px 20px rgba(255, 152, 0, 0.2)', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <button className="ls-back-btn" onClick={onBack} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Trophy size={40} /> Test Room
          </div>
          <div style={{ fontSize: '1.2rem', color: '#FFF3E0', marginTop: '0.5rem' }}>Show what you know and earn badges!</div>
        </div>
        
        {/* Stats */}
        <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderRadius: '20px', display: 'flex', gap: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold' }}>TEST XP</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>{score}</div>
          </div>
          <div style={{ width: '2px', backgroundColor: '#EEE' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold' }}>BADGES</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {completedTests.length} <Star size={24} fill="#FFC107" color="#FFB300" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {TEST_CATEGORIES.map((cat, idx) => {
            const isCompleted = completedTests.includes(cat.id);
            // Lock earlier tests? Let's leave them open, unlocking strictly causes friction for kids testing.
            
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectTest(cat)}
                style={{
                  width: '320px', padding: '2rem', borderRadius: '30px', border: 'none',
                  background: 'white', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'relative',
                  borderTop: `8px solid ${cat.color}`, transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div style={{
                    position: 'absolute', top: '15px', right: '15px', width: '40px', height: '40px',
                    backgroundColor: '#FFEB3B', borderRadius: '50%', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 2
                  }}>
                    <Star size={24} fill="#FF9800" color="#F57C00" />
                  </div>
                )}
                
                <div style={{
                  width: '80px', height: '80px', borderRadius: '20px', background: cat.gradient,
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem',
                  marginBottom: '1rem', boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
                }}>
                  {cat.emoji}
                </div>
                
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', margin: '0 0 0.5rem 0' }}>{cat.title}</h3>
                <p style={{ fontSize: '1.1rem', color: '#666', margin: 0, lineHeight: 1.4 }}>{cat.desc}</p>
                
                <div style={{ marginTop: '1.5rem', fontWeight: 'bold', color: cat.color, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                  {isCompleted ? 'Play Again' : 'Start Test'} →
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
