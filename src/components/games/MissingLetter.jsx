import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, Star, RotateCcw, PartyPopper } from 'lucide-react';

const MISSING_DATA = [
  { fullWord: 'CAT', incomplete: 'C _ T', missing: 'A', options: ['A', 'O', 'I'], audioHint: 'Cat. C A T.' },
  { fullWord: 'DOG', incomplete: 'D _ G', missing: 'O', options: ['E', 'A', 'O'], audioHint: 'Dog. D O G.' },
  { fullWord: 'SUN', incomplete: 'S _ N', missing: 'U', options: ['A', 'U', 'I'], audioHint: 'Sun. S U N.' },
  { fullWord: 'STAR', incomplete: 'S T _ R', missing: 'A', options: ['E', 'A', 'O'], audioHint: 'Star. S T A R.' },
  { fullWord: 'FISH', incomplete: 'F I S _', missing: 'H', options: ['H', 'S', 'T'], audioHint: 'Fish. F I S H.' }
];

export default function MissingLetter({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedWrong, setSelectedWrong] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadLevel(currentIndex);
  }, [currentIndex]);

  const loadLevel = (index) => {
    const data = MISSING_DATA[index];
    setIsSuccess(false);
    setSelectedWrong(null);
    setOptions([...data.options].sort(() => Math.random() - 0.5));
    
    // Auto-play hint
    setTimeout(() => {
      speakText(`Find the missing letter for ${data.fullWord}`);
    }, 400);
  };

  const handleSelect = (letter) => {
    if (isSuccess) return;
    const data = MISSING_DATA[currentIndex];
    
    if (letter === data.missing) {
      setIsSuccess(true);
      speakText(`Awesome! ${data.missing} is the missing letter for ${data.fullWord}!`);
      setScore(s => s + 10);
    } else {
      setSelectedWrong(letter);
      speakText(`Oops! That's ${letter}. Try again, you can do it!`);
      setTimeout(() => setSelectedWrong(null), 1000);
    }
  };

  const playTarget = () => {
    speakText(MISSING_DATA[currentIndex].audioHint);
  };

  const handleNext = () => {
    if (currentIndex < MISSING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('You found all the missing letters! Great job!');
      onBack();
    }
  };

  const currentData = MISSING_DATA[currentIndex];

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back to Games
        </button>
        <div className="ls-grid-title">❓ Missing Letter</div>
        <div className="ls-grid-sub">Tap the letter that finishes the word!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '3rem' }}>
        
        {/* Game Stats */}
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 3rem',
          backgroundColor: '#FFEBEE', borderRadius: '50px', border: '4px solid #E57373',
          color: '#C62828', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(229, 115, 115, 0.2)'
        }}>
          <div>Score: {score}</div>
          <div>Level: {currentIndex + 1} / {MISSING_DATA.length}</div>
        </div>

        {/* Word Display */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={playTarget}
            style={{
              width: '60px', height: '60px', borderRadius: '50%', border: 'none',
              backgroundColor: '#FF5252', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', boxShadow: '0 4px 0 #D32F2F', marginRight: '1rem'
            }}
          >
            <Volume2 size={30} />
          </button>
          
          <div style={{ 
            fontSize: '5rem', fontWeight: 'bold', letterSpacing: '0.5rem', 
            color: '#333', backgroundColor: '#FFF', padding: '1rem 3rem',
            borderRadius: '24px', border: '6px dashed #FFCDD2'
          }}>
            {isSuccess ? currentData.fullWord : currentData.incomplete}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
          {options.map((opt, i) => {
            const isWrong = selectedWrong === opt;
            const isCorrectDone = isSuccess && opt === currentData.missing;
            const isFaded = isSuccess && opt !== currentData.missing;
            
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={isSuccess || isWrong}
                style={{
                  width: '100px', height: '100px', fontSize: '4rem', fontWeight: 'bold',
                  backgroundColor: isWrong ? '#FFEBEE' : (isCorrectDone ? '#E8F5E9' : '#FFFFFF'),
                  border: isWrong ? '6px solid #FFCDD2' : (isCorrectDone ? '6px solid #81C784' : '6px solid #FFCDD2'),
                  color: isWrong ? '#F44336' : (isCorrectDone ? '#4CAF50' : '#E57373'),
                  borderRadius: '24px', cursor: (isSuccess || isWrong) ? 'default' : 'pointer',
                  boxShadow: isWrong || isCorrectDone ? 'none' : '0 8px 0 #EF9A9A',
                  transform: isWrong ? 'rotate(-10deg) scale(0.9)' : (isCorrectDone ? 'scale(1.1)' : 'scale(1)'),
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  opacity: isFaded ? 0.3 : 1
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isSuccess && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', animation: 'pop-in 0.5s' }}>
            <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 3rem', borderRadius: '50px', border: 'none', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 8px 0 #388E3C', animation: 'bounce 1s infinite' }}>
              {currentIndex === MISSING_DATA.length - 1 ? 'Finish!' : 'Next Word'}
              {!isSuccess && <Star size={24} />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
