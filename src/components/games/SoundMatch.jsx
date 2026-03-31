import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, Star, RotateCcw, PartyPopper } from 'lucide-react';

const SOUND_DATA = [
  { letter: 'B', soundHint: 'Ball' },
  { letter: 'C', soundHint: 'Cat' },
  { letter: 'D', soundHint: 'Dog' },
  { letter: 'F', soundHint: 'Fish' },
  { letter: 'M', soundHint: 'Monkey' },
  { letter: 'S', soundHint: 'Sun' },
  { letter: 'T', soundHint: 'Tree' },
  { letter: 'P', soundHint: 'Penguin' }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function SoundMatch({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedWrong, setSelectedWrong] = useState(null);
  const [score, setScore] = useState(0);

  // We will shuffle the total data, and do 5 rounds.
  const [gameSequence, setGameSequence] = useState([]);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const sequence = [...SOUND_DATA].sort(() => Math.random() - 0.5).slice(0, 5);
    setGameSequence(sequence);
    setCurrentIndex(0);
    setScore(0);
    loadLevel(sequence[0]);
  };

  const loadLevel = (targetItem) => {
    setIsSuccess(false);
    setSelectedWrong(null);
    
    // Pick 2 random decoys
    const decoys = [];
    while (decoys.length < 2) {
      const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      if (char !== targetItem.letter && !decoys.includes(char)) {
        decoys.push(char);
      }
    }
    
    const combined = [
      { id: 'target', letter: targetItem.letter, isCorrect: true },
      ...decoys.map((letter, i) => ({ id: `decoy-${i}`, letter, isCorrect: false }))
    ];
    
    setOptions(combined.sort(() => Math.random() - 0.5));
    
    // Auto-play the target
    setTimeout(() => {
      speakText(`Find the starting letter for ${targetItem.soundHint}`);
    }, 400);
  };

  const handleSelect = (opt) => {
    if (isSuccess) return;
    
    if (opt.isCorrect) {
      setIsSuccess(true);
      speakText(`Awesome! ${opt.letter} is for ${gameSequence[currentIndex].soundHint}`);
      setScore(s => s + 10);
      
      setTimeout(() => {
        if (currentIndex < gameSequence.length - 1) {
          setCurrentIndex(currentIndex + 1);
          loadLevel(gameSequence[currentIndex + 1]);
        }
      }, 2000);

    } else {
      setSelectedWrong(opt.id);
      speakText(`Not quite! That is ${opt.letter}. Try again, you can do it!`);
      setTimeout(() => setSelectedWrong(null), 1000);
    }
  };

  const playTarget = () => {
    speakText(`Find the starting letter for ${gameSequence[currentIndex].soundHint}`);
  };

  const isGameComplete = isSuccess && currentIndex === gameSequence.length - 1;

  if (gameSequence.length === 0) return null;

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back to Games
        </button>
        <div className="ls-grid-title">🎵 Sound Match</div>
        <div className="ls-grid-sub">Listen to the word and pick its first letter!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '3rem' }}>
        
        {/* Game Stats */}
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 3rem',
          backgroundColor: '#E8F5E9', borderRadius: '50px', border: '4px solid #81C784',
          color: '#2E7D32', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(129, 199, 132, 0.2)'
        }}>
          <div>Score: {score}</div>
          <div>Round: {currentIndex + 1} / {gameSequence.length}</div>
        </div>

        {!isGameComplete ? (
          <>
            {/* Play Button Container */}
            <div style={{ 
              padding: '2rem', backgroundColor: '#E8EAF6', borderRadius: '50%', 
              boxShadow: '0 10px 30px rgba(63, 81, 181, 0.2)', border: '8px solid white'
            }}>
              <button 
                onClick={playTarget}
                style={{
                  width: '120px', height: '120px', borderRadius: '50%', border: 'none',
                  backgroundColor: '#3F51B5', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  cursor: 'pointer', boxShadow: '0 8px 0 #303F9F', transition: 'transform 0.2s',
                  animation: !isSuccess ? 'pulse-blue 2s infinite' : 'none'
                }}
              >
                <Volume2 size={60} />
              </button>
            </div>

            {/* Options Grid */}
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
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
                      width: '120px', height: '120px', fontSize: '4.5rem', fontWeight: 'bold',
                      backgroundColor: isWrong ? '#FFEBEE' : (isCorrectDone ? '#E8F5E9' : '#FFFFFF'),
                      border: isWrong ? '6px solid #FFCDD2' : (isCorrectDone ? '6px solid #81C784' : '6px solid #C5CAE9'),
                      color: isWrong ? '#F44336' : (isCorrectDone ? '#4CAF50' : '#3F51B5'),
                      borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      cursor: (isSuccess || isWrong) ? 'default' : 'pointer',
                      boxShadow: isWrong || isCorrectDone ? 'none' : '0 8px 15px rgba(63, 81, 181, 0.2)',
                      transform: isWrong ? 'rotate(-10deg)' : (isCorrectDone ? 'scale(1.1)' : 'scale(1)'),
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      opacity: isFaded ? 0.3 : 1
                    }}
                  >
                    {opt.letter}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ color: '#27AE60', fontSize: '2.5rem', fontWeight: 'bold' }}>
              <PartyPopper size={40} style={{ display: 'inline', marginRight: '10px' }} />
              You did it! +{score} XP
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={initGame} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#3498DB', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 8px 0 #2980B9' }}>
                <RotateCcw size={28} /> Play Again
              </button>
              <button 
                onClick={onBack}
                style={{ padding: '1.2rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#F39C12', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', boxShadow: '0 8px 0 #D68910', transition: 'transform 0.2s' }}
              >
                <Star size={28} /> Collect Reward
              </button>
            </div>
          </div>
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
