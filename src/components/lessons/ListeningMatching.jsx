import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, ArrowRight } from 'lucide-react';

const LISTENING_DATA = [
  { targetWord: 'Bear', audio: 'Bear', image: '🐻' },
  { targetWord: 'Train', audio: 'Train', image: '🚂' },
  { targetWord: 'Apple', audio: 'Apple', image: '🍎' },
  { targetWord: 'Rocket', audio: 'Rocket', image: '🚀' },
  { targetWord: 'Guitar', audio: 'Guitar', image: '🎸' }
];

const DECOY_IMAGES = ['🚗', '🐘', '🍌', '⚽', '🦓', '🚁', '🏠', '🍕'];

export default function ListeningMatching({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedWrong, setSelectedWrong] = useState(null);

  useEffect(() => {
    loadLevel(currentIndex);
  }, [currentIndex]);

  const loadLevel = (index) => {
    const target = LISTENING_DATA[index];
    setIsSuccess(false);
    setSelectedWrong(null);
    
    // Pick 3 random decoys
    const shuffledDecoys = [...DECOY_IMAGES].sort(() => Math.random() - 0.5);
    const selectedDecoys = shuffledDecoys.slice(0, 3);
    
    const combined = [
      { id: 'target', emoji: target.image, isCorrect: true },
      ...selectedDecoys.map((emoji, i) => ({ id: `decoy-${i}`, emoji, isCorrect: false }))
    ];
    
    setOptions(combined.sort(() => Math.random() - 0.5));
    
    // Auto-play the target
    setTimeout(() => {
      speakText(`Find the ${target.audio}`);
    }, 400);
  };

  const handleSelect = (opt) => {
    if (isSuccess) return;
    
    if (opt.isCorrect) {
      setIsSuccess(true);
      speakText("Yes! You found it!");
    } else {
      setSelectedWrong(opt.id);
      speakText("Not quite! Try again, you can do it!");
      setTimeout(() => setSelectedWrong(null), 1000);
    }
  };

  const handleNext = () => {
    if (currentIndex < LISTENING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('Great listening skills! You finished the lesson.');
      onBack();
    }
  };

  const playTarget = () => {
    speakText(`Find the ${LISTENING_DATA[currentIndex].audio}`);
  };

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">🎧 Listening & Matching</div>
        <div className="ls-grid-sub">Listen carefully and tap the right picture!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem', gap: '3rem' }}>
        
        {/* Play Button Container */}
        <div style={{ 
          padding: '2rem', backgroundColor: '#E8EAF6', borderRadius: '50%', 
          boxShadow: '0 10px 30px rgba(63, 81, 181, 0.2)', border: '8px solid white'
        }}>
          <button 
            onClick={playTarget}
            style={{
              width: '100px', height: '100px', borderRadius: '50%', border: 'none',
              backgroundColor: '#3F51B5', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', boxShadow: '0 8px 0 #303F9F', transition: 'transform 0.2s',
              animation: !isSuccess ? 'pulse-blue 2s infinite' : 'none'
            }}
          >
            <Volume2 size={50} />
          </button>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: '600px' }}>
          {options.map(opt => {
            const isWrong = selectedWrong === opt.id;
            const isCorrectDone = isSuccess && opt.isCorrect;
            const isFaded = isSuccess && !opt.isCorrect;
            
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={isSuccess || isWrong}
                style={{
                  width: '120px', height: '120px', fontSize: '5rem',
                  backgroundColor: isWrong ? '#FFEBEE' : (isCorrectDone ? '#E8F5E9' : '#FFFFFF'),
                  border: isWrong ? '4px solid #FFCDD2' : (isCorrectDone ? '4px solid #C8E6C9' : '4px solid #C5CAE9'),
                  borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  cursor: (isSuccess || isWrong) ? 'default' : 'pointer',
                  boxShadow: isWrong || isCorrectDone ? 'none' : '0 8px 15px rgba(63, 81, 181, 0.1)',
                  transform: isWrong ? 'rotate(-10deg)' : (isCorrectDone ? 'scale(1.1)' : 'scale(1)'),
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  opacity: isFaded ? 0.3 : 1
                }}
              >
                {opt.emoji}
              </button>
            );
          })}
        </div>

        {isSuccess && (
          <button 
            onClick={handleNext}
            style={{
              padding: '1rem 3rem', borderRadius: '50px', border: 'none',
              backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer',
              boxShadow: '0 8px 0 #388E3C', animation: 'bounce 1s infinite'
            }}
          >
            {currentIndex === LISTENING_DATA.length - 1 ? 'Finish!' : 'Next'} <ArrowRight size={28} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(63, 81, 181, 0); }
          100% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0); }
        }
      `}</style>
    </div>
  );
}
