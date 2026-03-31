import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  { ask: 'Build: The cat is big', target: 'The cat is big', words: ['is', 'cat', 'The', 'big'] },
  { ask: 'Build: I see a dog', target: 'I see a dog', words: ['see', 'dog', 'a', 'I'] },
  { ask: 'Build: It is a red car', target: 'It is a red car', words: ['a', 'red', 'is', 'car', 'It'] },
  { ask: 'Build: The sun is hot', target: 'The sun is hot', words: ['sun', 'is', 'The', 'hot'] },
  { ask: 'Build: We can play now', target: 'We can play now', words: ['now', 'play', 'can', 'We'] },
];

export default function SentenceTest({ speakText, onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [availableWords, setAvailableWords] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = QUESTIONS[currentIdx];

  useEffect(() => {
    if (!isDone && currentIdx === 0) {
      speakText('Welcome to the Sentence Formation test! Tap the words in the correct order.');
      setTimeout(playQuestionAudio, 3000);
      setupLevel(0);
    } else if (!isDone) {
      playQuestionAudio();
      setupLevel(currentIdx);
    }
  }, [currentIdx, isDone]);

  const setupLevel = (idx) => {
    const question = QUESTIONS[idx];
    setAvailableWords(question.words.map((w, i) => ({ id: `w-${i}`, text: w })));
    setSlots(Array(question.words.length).fill(null));
  };

  const playQuestionAudio = () => {
    speakText(QUESTIONS[currentIdx].ask);
  };

  const handleTapAvailable = (wordObj) => {
    if (showFeedback) return;
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty === -1) return; // Full
    
    // Move to slots
    const newSlots = [...slots];
    newSlots[firstEmpty] = wordObj;
    setSlots(newSlots);
    
    setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id));
    
    // Check if full
    if (firstEmpty === slots.length - 1) {
      const formedSentence = newSlots.map(s => s.text).join(' ');
      evaluateAnswer(formedSentence);
    }
  };

  const handleTapSlot = (wordObj, index) => {
    if (showFeedback || !wordObj) return;
    // Move back to available
    setAvailableWords(prev => [...prev, wordObj]);
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
  };

  const evaluateAnswer = (sentence) => {
    setShowFeedback(true);
    const correct = sentence === q.target;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      speakText(`Correct! ${q.target}!`);
    } else {
      speakText(`Oops! That doesn't look right. Let's try spelling it correctly 😊`);
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
    const passed = score >= 30;
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '6px solid #00BCD4' }}>
          <Star size={100} fill={passed ? "#FFC107" : "#E0E0E0"} color={passed ? "#FF9800" : "#9E9E9E"} style={{ animation: passed ? 'bounce 2s infinite' : 'none' }} />
          <h2 style={{ fontSize: '3rem', color: '#0097A7', margin: '1rem 0' }}>Sentence Star!</h2>
          <p style={{ fontSize: '1.5rem', color: '#666' }}>Your Score: <strong>{score} / {QUESTIONS.length * 10}</strong></p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setShowFeedback(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'border: none', backgroundColor: '#F44336', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
              <RotateCcw size={20} /> Retry Test
            </button>
            <button onClick={() => onComplete(score)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#00BCD4', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
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
        <div className="ls-grid-title">🧩 Sentence Test</div>
        <button className="ls-back-btn" onClick={playQuestionAudio} style={{ backgroundColor: '#2196F3', color: 'white', borderColor: '#1976D2' }}>
          <Volume2 size={20} /> Hear Target
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>Q{currentIdx + 1}</span>
        <div style={{ flex: 1, height: '15px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#00BCD4', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>{score} XP</span>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '4px solid #E0F7FA' }}>
        
        <h2 style={{ fontSize: '2.5rem', color: '#0097A7', marginBottom: '3rem' }}>{q.ask}</h2>

        {/* Construction Slots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          {slots.map((item, i) => (
            <div 
              key={i} 
              onClick={() => handleTapSlot(item, i)}
              style={{
                minWidth: '120px', height: '80px', border: '4px dashed #80DEEA', borderRadius: '16px',
                display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA',
                cursor: item && !showFeedback ? 'pointer' : 'default', padding: '0 1rem',
                ...(showFeedback && item && isCorrect && { borderColor: '#4CAF50', backgroundColor: '#E8F5E9', transform: 'scale(1.05)', transition: 'all 0.3s bounce' }),
                ...(showFeedback && item && !isCorrect && { borderColor: '#F44336', backgroundColor: '#FFEBEE', transform: 'rotate(-2deg)', transition: 'all 0.3s ease' })
              }}
            >
              {item && (
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00838F' }}>
                  {item.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scattered Words */}
        <h3 style={{ color: '#999', fontSize: '1.2rem', marginBottom: '1rem' }}>Tap words to build the sentence!</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {availableWords.map(item => (
            <button
              key={item.id}
              onClick={() => handleTapAvailable(item)}
              disabled={showFeedback}
              style={{
                padding: '1rem 2rem', borderRadius: '16px', border: 'none',
                backgroundColor: '#B2EBF2', color: '#00838F', fontSize: '2rem', fontWeight: 'bold',
                boxShadow: '0 8px 0 #4DD0E1', cursor: showFeedback ? 'default' : 'pointer',
                transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'translateY(8px)'}
              onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {item.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
