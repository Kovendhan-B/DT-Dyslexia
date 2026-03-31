import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  { ask: 'Spell the word CAT', target: 'CAT', letters: ['T', 'A', 'C'] },
  { ask: 'Spell the word DOG', target: 'DOG', letters: ['O', 'G', 'D'] },
  { ask: 'Spell the word SUN', target: 'SUN', letters: ['N', 'S', 'U'] },
  { ask: 'Spell the word HAT', target: 'HAT', letters: ['A', 'T', 'H'] },
  { ask: 'Spell the word FISH', target: 'FISH', letters: ['S', 'I', 'H', 'F'] },
  { ask: 'Spell the word BIRD', target: 'BIRD', letters: ['R', 'D', 'B', 'I'] },
];

export default function WordBuildingTest({ speakText, onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [availableLetters, setAvailableLetters] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = QUESTIONS[currentIdx];

  useEffect(() => {
    if (!isDone && currentIdx === 0) {
      speakText('Welcome to the Word Building test! Tap the letters in the correct order.');
      setTimeout(playQuestionAudio, 3000);
      setupLevel(0);
    } else if (!isDone) {
      playQuestionAudio();
      setupLevel(currentIdx);
    }
  }, [currentIdx, isDone]);

  const setupLevel = (idx) => {
    const question = QUESTIONS[idx];
    setAvailableLetters(question.letters.map((l, i) => ({ id: `l-${i}`, char: l })));
    setSlots(Array(question.target.length).fill(null));
  };

  const playQuestionAudio = () => {
    speakText(QUESTIONS[currentIdx].ask);
  };

  const handleTapAvailable = (letterObj) => {
    if (showFeedback) return;
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty === -1) return; // Full
    
    // Move to slots
    const newSlots = [...slots];
    newSlots[firstEmpty] = letterObj;
    setSlots(newSlots);
    
    setAvailableLetters(prev => prev.filter(l => l.id !== letterObj.id));
    
    // Check if full
    if (firstEmpty === slots.length - 1) {
      const formedWord = newSlots.map(s => s.char).join('');
      evaluateAnswer(formedWord);
    }
  };

  const handleTapSlot = (letterObj, index) => {
    if (showFeedback || !letterObj) return;
    // Move back to available
    setAvailableLetters(prev => [...prev, letterObj]);
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
  };

  const evaluateAnswer = (word) => {
    setShowFeedback(true);
    const correct = word === q.target;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      speakText(`Correct! You spelled ${q.target}!`);
    } else {
      speakText(`Oops! That spells ${word}. Try spelling ${q.target} again 😊`);
    }

    setTimeout(() => {
      if (correct) {
        if (currentIdx === QUESTIONS.length - 1) {
          setIsDone(true);
          speakText('Test complete! Let\'s look at your score.');
        } else {
          setCurrentIdx(c => c + 1);
          setShowFeedback(false);
        }
      } else {
        // Reset level
        setupLevel(currentIdx);
        setShowFeedback(false);
      }
    }, 2500);
  };

  const pct = Math.round((currentIdx / QUESTIONS.length) * 100);

  if (isDone) {
    const passed = score >= 40;
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '6px solid #FF9800' }}>
          <Star size={100} fill={passed ? "#FFC107" : "#E0E0E0"} color={passed ? "#FF9800" : "#9E9E9E"} style={{ animation: passed ? 'bounce 2s infinite' : 'none' }} />
          <h2 style={{ fontSize: '3rem', color: '#E65100', margin: '1rem 0' }}>Builder Champion!</h2>
          <p style={{ fontSize: '1.5rem', color: '#666' }}>Your Score: <strong>{score} / {QUESTIONS.length * 10}</strong></p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setShowFeedback(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'border: none', backgroundColor: '#F44336', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
              <RotateCcw size={20} /> Retry Test
            </button>
            <button onClick={() => onComplete(score)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
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
        <div className="ls-grid-title">🏗️ Word Building</div>
        <button className="ls-back-btn" onClick={playQuestionAudio} style={{ backgroundColor: '#2196F3', color: 'white', borderColor: '#1976D2' }}>
          <Volume2 size={20} /> Hear Word
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>Q{currentIdx + 1}</span>
        <div style={{ flex: 1, height: '15px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#FF9800', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>{score} XP</span>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '4px solid #FFF3E0' }}>
        
        <h2 style={{ fontSize: '2.5rem', color: '#E65100', marginBottom: '3rem' }}>{q.ask}</h2>

        {/* Construction Slots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          {slots.map((item, i) => (
            <div 
              key={i} 
              onClick={() => handleTapSlot(item, i)}
              style={{
                width: '100px', height: '100px', border: '6px dashed #FFCC80', borderRadius: '20px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA',
                cursor: item && !showFeedback ? 'pointer' : 'default',
                ...(showFeedback && item && isCorrect && { borderColor: '#4CAF50', backgroundColor: '#E8F5E9', transform: 'scale(1.1)', transition: 'all 0.3s bounce' }),
                ...(showFeedback && item && !isCorrect && { borderColor: '#F44336', backgroundColor: '#FFEBEE', transform: 'rotate(-5deg)', transition: 'all 0.3s ease' })
              }}
            >
              {item && (
                <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#F57C00' }}>
                  {item.char}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scattered Letters */}
        <h3 style={{ color: '#999', fontSize: '1.2rem', marginBottom: '1rem' }}>Tap letters to build the word!</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {availableLetters.map(item => (
            <button
              key={item.id}
              onClick={() => handleTapAvailable(item)}
              disabled={showFeedback}
              style={{
                width: '100px', height: '100px', borderRadius: '20px', border: 'none',
                backgroundColor: '#FFE0B2', color: '#E65100', fontSize: '4rem', fontWeight: 'bold',
                boxShadow: '0 8px 0 #FFB74D', cursor: showFeedback ? 'default' : 'pointer',
                transform: `rotate(${(Math.random() - 0.5) * 15}deg)`,
                transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'translateY(8px)'}
              onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {item.char}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
