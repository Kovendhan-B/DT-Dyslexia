import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  { ask: "Find the letter for the sound... 'buh'", soundText: "buh", right: 'B', options: ['D', 'B', 'P'] },
  { ask: "Find the letter for the sound... 'cuh'", soundText: "cuh", right: 'C', options: ['S', 'K', 'C'] },
  { ask: "Find the letter for the sound... 'mmm'", soundText: "mmm", right: 'M', options: ['N', 'W', 'M'] },
  { ask: "Find the letter for the sound... 'sss'", soundText: "sss", right: 'S', options: ['S', 'C', 'Z'] },
  { ask: "Find the letter for the sound... 'tuh'", soundText: "tuh", right: 'T', options: ['D', 'T', 'F'] },
  { ask: "Find the letter for the sound... 'ff'", soundText: "ff", right: 'F', options: ['V', 'T', 'F'] },
  { ask: "Find the letter for the sound... 'ruh'", soundText: "ruh", right: 'R', options: ['L', 'W', 'R'] },
  { ask: "Find the letter for the sound... 'puh'", soundText: "puh", right: 'P', options: ['B', 'Q', 'P'] },
];

export default function PhonicsTest({ speakText, onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = QUESTIONS[currentIdx];

  useEffect(() => {
    if (!isDone && currentIdx === 0) {
      speakText('Welcome to the Phonics Test! Listen closely to the sounds.');
      setTimeout(playQuestionAudio, 3000);
    } else if (!isDone) {
      playQuestionAudio();
    }
  }, [currentIdx, isDone]);

  const playQuestionAudio = () => {
    speakText(QUESTIONS[currentIdx].ask);
  };

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);

    const correct = opt === q.right;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      speakText(`Correct! ${q.right} makes the sound ${q.soundText}.`);
    } else {
      speakText('Oops! Listen again and try to find the right letter.');
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
    const passed = score >= 70;
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '6px solid #F44336' }}>
          <Star size={100} fill={passed ? "#FFC107" : "#E0E0E0"} color={passed ? "#FF9800" : "#9E9E9E"} style={{ animation: passed ? 'bounce 2s infinite' : 'none' }} />
          <h2 style={{ fontSize: '3rem', color: '#D32F2F', margin: '1rem 0' }}>Phonics Complete!</h2>
          <p style={{ fontSize: '1.5rem', color: '#666' }}>Your Score: <strong>{score} / {QUESTIONS.length * 10}</strong></p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setShowFeedback(false); setSelectedOpt(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'border: none', backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
              <RotateCcw size={20} /> Retry Test
            </button>
            <button onClick={() => onComplete(score)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#F44336', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
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
        <div className="ls-grid-title">🗣️ Phonics Test</div>
        <button className="ls-back-btn" onClick={playQuestionAudio} style={{ backgroundColor: '#2196F3', color: 'white', borderColor: '#1976D2' }}>
          <Volume2 size={20} /> Hear Sound
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>Q{currentIdx + 1}</span>
        <div style={{ flex: 1, height: '15px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#F44336', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>{score} XP</span>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '4px solid #FFEBEE' }}>
        
        <button 
          onClick={playQuestionAudio}
          style={{ width: '120px', height: '120px', borderRadius: '50%', border: 'none', backgroundColor: '#F44336', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 8px 0 #D32F2F', margin: '0 auto 2rem auto', transition: 'transform 0.1s' }}
          onMouseDown={e => e.currentTarget.style.transform = 'translateY(6px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Volume2 size={60} />
        </button>
        
        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '3rem' }}>Tap the letter that makes the sound you hear!</h2>

        {/* Options */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const statusColor = showFeedback && isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : '#FFEBEE';
            const textColor = showFeedback && isSelected ? 'white' : '#C62828';

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showFeedback}
                style={{
                  width: '120px', height: '120px', fontSize: '4rem', fontWeight: 'bold',
                  backgroundColor: statusColor, color: textColor,
                  border: `4px solid ${showFeedback && isSelected ? statusColor : '#FFCDD2'}`,
                  borderRadius: '24px', cursor: showFeedback ? 'default' : 'pointer',
                  boxShadow: showFeedback && isSelected ? 'none' : '0 8px 0 #EF9A9A',
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
