import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  { image: '🍎', right: 'Apple', options: ['Cat', 'Apple', 'Dog'] },
  { image: '🐶', right: 'Dog', options: ['Dog', 'Sun', 'Hat'] },
  { image: '☀️', right: 'Sun', options: ['Cat', 'Star', 'Sun'] },
  { image: '🎩', right: 'Hat', options: ['Hat', 'Fish', 'Ball'] },
  { image: '⚽', right: 'Ball', options: ['Cat', 'Dog', 'Ball'] },
  { image: '🐱', right: 'Cat', options: ['Bat', 'Cat', 'Mat'] },
  { image: '🐟', right: 'Fish', options: ['Fish', 'Dish', 'Wish'] },
  { image: '🚗', right: 'Car', options: ['Far', 'Car', 'Jar'] },
];

export default function SimpleWordsTest({ speakText, onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = QUESTIONS[currentIdx];

  useEffect(() => {
    if (!isDone && currentIdx === 0) {
      speakText('Welcome to the Simple Words test! Look at the picture and find the word.');
      setTimeout(playQuestionAudio, 3000);
    } else if (!isDone) {
      playQuestionAudio();
    }
  }, [currentIdx, isDone]);

  const playQuestionAudio = () => {
    speakText('What is this a picture of?');
  };

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);

    const correct = opt === q.right;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      speakText(`Correct! That is a ${q.right}.`);
    } else {
      speakText(`Oops! That word is ${opt}. Let's find ${q.right}. Try again 😊`);
    }

    setTimeout(() => {
      if (correct) {
        if (currentIdx === QUESTIONS.length - 1) {
          setIsDone(true);
          speakText('Test complete! Let\'s look at your score.');
        } else {
          setCurrentIdx(c => c + 1);
          setShowFeedback(false);
          setSelectedOpt(null);
        }
      } else {
        setShowFeedback(false);
        setSelectedOpt(null);
      }
    }, 2500);
  };

  const pct = Math.round((currentIdx / QUESTIONS.length) * 100);

  if (isDone) {
    const passed = score >= 60;
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '6px solid #2196F3' }}>
          <Star size={100} fill={passed ? "#FFC107" : "#E0E0E0"} color={passed ? "#FF9800" : "#9E9E9E"} style={{ animation: passed ? 'bounce 2s infinite' : 'none' }} />
          <h2 style={{ fontSize: '3rem', color: '#1976D2', margin: '1rem 0' }}>Words Master!</h2>
          <p style={{ fontSize: '1.5rem', color: '#666' }}>Your Score: <strong>{score} / {QUESTIONS.length * 10}</strong></p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setShowFeedback(false); setSelectedOpt(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'border: none', backgroundColor: '#9C27B0', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
              <RotateCcw size={20} /> Retry Test
            </button>
            <button onClick={() => onComplete(score)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
              Claim Reward <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header" style={{ marginBottom: '1rem' }}>
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Quit Test
        </button>
        <div className="ls-grid-title">🍎 Simple Words</div>
        <button className="ls-back-btn" onClick={playQuestionAudio} style={{ backgroundColor: '#FF9800', color: 'white', borderColor: '#F57C00' }}>
          <Volume2 size={20} /> Hear audio
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>Q{currentIdx + 1}</span>
        <div style={{ flex: 1, height: '15px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#2196F3', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>{score} XP</span>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '4px solid #E3F2FD' }}>
        
        <div style={{ fontSize: '7rem', margin: '0 auto 2rem auto', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}>
          {q.image}
        </div>
        

        {/* Options */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const statusColor = showFeedback && isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : '#F5F5F5';
            const textColor = showFeedback && isSelected ? 'white' : '#333';

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showFeedback}
                style={{
                  minWidth: '150px', padding: '1rem 3rem', fontSize: '2.5rem', fontWeight: 'bold',
                  backgroundColor: statusColor, color: textColor,
                  border: `4px solid ${showFeedback && isSelected ? statusColor : '#E0E0E0'}`,
                  borderRadius: '24px', cursor: showFeedback ? 'default' : 'pointer',
                  boxShadow: showFeedback && isSelected ? 'none' : '0 8px 0 #BDBDBD',
                  transform: showFeedback && isSelected ? 'translateY(8px)' : 'translateY(0)',
                  transition: 'all 0.2s ease', letterSpacing: '2px'
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
