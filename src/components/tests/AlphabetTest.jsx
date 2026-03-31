import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const ALPHABET_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Pre-generated balanced test questions
const QUESTIONS = [
  { type: 'find', letter: 'A', ask: 'Find the letter A', options: ['B', 'A', 'M'] },
  { type: 'match-lower', upper: 'G', ask: 'Match to lowercase', options: ['j', 'g', 'q'], right: 'g' },
  { type: 'find', letter: 'P', ask: 'Find the letter P', options: ['D', 'P', 'R'] },
  { type: 'match-upper', lower: 'm', ask: 'Match to uppercase', options: ['N', 'H', 'M'], right: 'M' },
  { type: 'find', letter: 'S', ask: 'Find the letter S', options: ['Z', 'C', 'S'] },
  { type: 'match-lower', upper: 'R', ask: 'Match to lowercase', options: ['r', 'n', 'p'], right: 'r' },
  { type: 'find', letter: 'K', ask: 'Find the letter K', options: ['K', 'X', 'Y'] },
  { type: 'match-upper', lower: 'e', ask: 'Match to uppercase', options: ['F', 'E', 'B'], right: 'E' },
  { type: 'find', letter: 'W', ask: 'Find the letter W', options: ['M', 'V', 'W'] },
  { type: 'match-lower', upper: 'L', ask: 'Match to lowercase', options: ['i', 't', 'l'], right: 'l' },
];

export default function AlphabetTest({ speakText, onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  // States for feedback
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = QUESTIONS[currentIdx];

  useEffect(() => {
    if (!isDone && currentIdx === 0) {
      speakText('Welcome to the Alphabet Test! Let\'s begin.');
      setTimeout(playQuestionAudio, 2500);
    } else if (!isDone) {
      playQuestionAudio();
    }
  }, [currentIdx, isDone]);

  const playQuestionAudio = () => {
    const q = QUESTIONS[currentIdx];
    speakText(q.ask);
  };

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);

    let correct = false;
    if (q.type === 'find') correct = opt === q.letter;
    else correct = opt === q.right;

    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      speakText('Correct! Great job!');
    } else {
      speakText('Oops! Try again 😊');
    }

    // Auto clear or move next
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
    }, 2000);
  };

  const pct = Math.round((currentIdx / QUESTIONS.length) * 100);

  if (isDone) {
    const passed = score >= 70;
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '6px solid #4CAF50' }}>
          <Star size={100} fill={passed ? "#FFC107" : "#E0E0E0"} color={passed ? "#FF9800" : "#9E9E9E"} style={{ animation: passed ? 'bounce 2s infinite' : 'none' }} />
          <h2 style={{ fontSize: '3rem', color: '#2E7D32', margin: '1rem 0' }}>Test Complete!</h2>
          <p style={{ fontSize: '1.5rem', color: '#666' }}>Your Score: <strong>{score} / 100</strong></p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setShowFeedback(false); setSelectedOpt(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'border: none', backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
              <RotateCcw size={20} /> Retry Test
            </button>
            <button onClick={() => onComplete(score)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
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
        <div className="ls-grid-title">🔠 Alphabet Test</div>
        <button className="ls-back-btn" onClick={playQuestionAudio} style={{ backgroundColor: '#2196F3', color: 'white', borderColor: '#1976D2' }}>
          <Volume2 size={20} /> Hear Again
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>Q{currentIdx + 1}</span>
        <div style={{ flex: 1, height: '15px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#4CAF50', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>{score} XP</span>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '4px solid #F1F8E9' }}>
        
        <h2 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '2rem' }}>{q.ask}</h2>
        
        {/* Visual Target */}
        {(q.type === 'match-lower' || q.type === 'match-upper') && (
          <div style={{ fontSize: '6rem', fontWeight: 'bold', color: '#E91E63', marginBottom: '2rem', background: '#FCE4EC', display: 'inline-block', width: '150px', height: '150px', lineHeight: '150px', borderRadius: '30px' }}>
            {q.upper || q.lower}
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const statusColor = showFeedback && isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : '#E3F2FD';
            const textColor = showFeedback && isSelected ? 'white' : '#1565C0';

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showFeedback}
                style={{
                  width: '120px', height: '120px', fontSize: '4rem', fontWeight: 'bold',
                  backgroundColor: statusColor, color: textColor,
                  border: `4px solid ${showFeedback && isSelected ? statusColor : '#BBDEFB'}`,
                  borderRadius: '24px', cursor: showFeedback ? 'default' : 'pointer',
                  boxShadow: showFeedback && isSelected ? 'none' : '0 8px 0 #90CAF9',
                  transform: showFeedback && isSelected ? 'translateY(8px)' : 'translateY(0)',
                  transition: 'all 0.2s ease'
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
