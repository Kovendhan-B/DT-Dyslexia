import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Clock, PartyPopper } from 'lucide-react';

const QUICK_DATA = [
  { targetWord: 'Apple', options: ['🍎', '🍌', '🍇', '🍉'], correct: '🍎' },
  { targetWord: 'Dog', options: ['🐱', '🐶', '🐘', '🦊'], correct: '🐶' },
  { targetWord: 'Car', options: ['🚗', '✈️', '🚲', '🚀'], correct: '🚗' },
  { targetWord: 'Sun', options: ['🌙', '⭐', '☁️', '☀️'], correct: '☀️' },
  { targetWord: 'Fish', options: ['🐸', '🐟', '🐢', '🦀'], correct: '🐟' },
  { targetWord: 'Bird', options: ['🐧', '🐦', '🦋', '🐤'], correct: '🐦' }
];

export default function QuickTap({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // percentage 100 to 0
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadLevel(0);
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0 && !isSuccess) {
      timer = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 80); // 80ms * 100 = ~8 seconds per round
    } else if (timeLeft === 0 && !isSuccess) {
      // Time up (stress free)
      setIsPlaying(false);
      speakText(`Time's up! The answer was ${QUICK_DATA[currentIndex].targetWord}. Let's do the next one!`);
      setTimeout(() => {
        handleNext();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, isSuccess, currentIndex]);

  const loadLevel = (index) => {
    setCurrentIndex(index);
    setTimeLeft(100);
    setIsSuccess(false);
    setIsPlaying(true);
    
    // Auto-play target word
    setTimeout(() => {
      speakText(`Find the ${QUICK_DATA[index].targetWord} quickly!`);
    }, 400);
  };

  const handleSelect = (emoji) => {
    if (isSuccess || !isPlaying) return;
    
    const data = QUICK_DATA[currentIndex];
    if (emoji === data.correct) {
      // Correct!
      setIsPlaying(false);
      setIsSuccess(true);
      
      // Calculate speed bonus
      const bonus = Math.floor(timeLeft / 10);
      const pointsEarned = 10 + bonus;
      setScore(s => s + pointsEarned);
      
      speakText(`Wow, so fast! You tapped ${data.targetWord}!`);
    } else {
      // Wrong (mild penalty to avoid random tapping, but still keep it stress free)
      speakText('Oops! Try another one quickly!');
      setTimeLeft(t => Math.max(t - 10, 0));
    }
  };

  const handleNext = () => {
    if (currentIndex < QUICK_DATA.length - 1) {
      loadLevel(currentIndex + 1);
    } else {
      setIsPlaying(false);
      speakText('You finished Quick Tap! You are super fast!');
    }
  };

  const currentData = QUICK_DATA[currentIndex];
  const isGameComplete = isSuccess && currentIndex === QUICK_DATA.length - 1;

  // Determine progress bar color based on time left
  let progressColor = '#4CAF50';
  if (timeLeft < 50) progressColor = '#FFC107';
  if (timeLeft < 25) progressColor = '#F44336';

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back to Games
        </button>
        <div className="ls-grid-title">⚡ Quick Tap</div>
        <div className="ls-grid-sub">Tap the right picture before the bar empties!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '2rem' }}>
        
        {/* Game Stats */}
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 3rem',
          backgroundColor: '#E0F7FA', borderRadius: '50px', border: '4px solid #00BCD4',
          color: '#0097A7', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(0, 188, 212, 0.2)'
        }}>
          <div>Score: {score}</div>
          <div>Level: {currentIndex + 1} / {QUICK_DATA.length}</div>
        </div>

        {/* The Word */}
        <div style={{ 
          fontSize: '4.5rem', fontWeight: 'bold', color: '#333',
          padding: '1rem 4rem', backgroundColor: 'white', borderRadius: '24px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)', border: '4px solid #B2EBF2',
          marginTop: '1rem'
        }}>
          {currentData.targetWord}
        </div>

        {/* Timer Bar */}
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={30} color={progressColor} />
          <div style={{ flex: 1, height: '20px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: `${timeLeft}%`, height: '100%', backgroundColor: progressColor,
              transition: 'width 0.1s linear, background-color 0.5s'
            }} />
          </div>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
          {currentData.options.map((emoji, i) => {
            const isCorrectDone = isSuccess && emoji === currentData.correct;
            const isFaded = isSuccess && emoji !== currentData.correct;
            
            return (
              <button
                key={i}
                onClick={() => handleSelect(emoji)}
                disabled={!isPlaying || isSuccess}
                style={{
                  width: '130px', height: '130px', fontSize: '5rem',
                  backgroundColor: isCorrectDone ? '#E8F5E9' : '#FFFFFF',
                  border: isCorrectDone ? '8px solid #4CAF50' : '8px solid #80DEEA',
                  borderRadius: '24px', cursor: (!isPlaying || isSuccess) ? 'default' : 'pointer',
                  boxShadow: isCorrectDone ? 'none' : '0 8px 15px rgba(0, 188, 212, 0.3)',
                  transform: isCorrectDone ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s',
                  opacity: isFaded ? 0.3 : 1
                }}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {/* Result Action */}
        {(isSuccess || (!isPlaying && timeLeft === 0)) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', animation: 'pop-in 0.5s', marginTop: '1rem' }}>
            {!isGameComplete ? (
              <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 3rem', borderRadius: '50px', border: 'none', backgroundColor: '#00BCD4', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 8px 0 #0097A7', animation: 'bounce 1s infinite' }}>
                Next Puzzle! <Star size={24} />
              </button>
            ) : (
              <>
                <div style={{ color: '#0097A7', fontSize: '2.5rem', fontWeight: 'bold' }}>
                  <PartyPopper size={40} style={{ display: 'inline', marginRight: '10px' }} />
                  Game Over! Total: {score} XP
                </div>
                <button onClick={onBack} style={{ padding: '1.2rem 3rem', borderRadius: '50px', border: 'none', backgroundColor: '#F39C12', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', boxShadow: '0 8px 0 #D68910', transition: 'transform 0.2s' }}>
                  <Star size={28} /> Collect Reward
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
