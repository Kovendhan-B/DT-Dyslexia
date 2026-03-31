import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, RotateCcw, PartyPopper } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function LetterMatch({ speakText, onBack }) {
  const [upperPool, setUpperPool] = useState([]);
  const [lowerPool, setLowerPool] = useState([]);
  const [selectedUpper, setSelectedUpper] = useState(null);
  const [selectedLower, setSelectedLower] = useState(null);
  const [matchedLetters, setMatchedLetters] = useState([]);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongMatch, setWrongMatch] = useState(null);

  useEffect(() => {
    initLevel();
  }, []);

  const initLevel = () => {
    // Pick 5 random letters
    const picked = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 5);
    
    // Create pools
    const uppers = picked.map(l => ({ letter: l, id: `U-${l}` }));
    const lowers = picked.map(l => ({ letter: l.toLowerCase(), id: `L-${l}` }));

    setUpperPool(uppers.sort(() => Math.random() - 0.5));
    setLowerPool(lowers.sort(() => Math.random() - 0.5));
    
    setSelectedUpper(null);
    setSelectedLower(null);
    setMatchedLetters([]);
    setIsSuccess(false);
    
    speakText("Match the big letter with the small letter!");
  };

  const checkMatch = (upperObj, lowerObj) => {
    if (!upperObj || !lowerObj) return;

    if (upperObj.letter.toLowerCase() === lowerObj.letter) {
      // Correct!
      speakText('Awesome match!');
      setMatchedLetters(prev => [...prev, upperObj.letter]);
      setScore(s => s + 10);
      setSelectedUpper(null);
      setSelectedLower(null);

      if (matchedLetters.length + 1 === 5) {
        setIsSuccess(true);
        setTimeout(() => speakText('You did it! Great job matching letters!'), 600);
      }
    } else {
      // Incorrect
      speakText('Oops! Try again, you can do it!');
      setWrongMatch(true);
      setTimeout(() => {
        setSelectedUpper(null);
        setSelectedLower(null);
        setWrongMatch(false);
      }, 1000);
    }
  };

  const handleUpperClick = (item) => {
    if (matchedLetters.includes(item.letter) || wrongMatch) return;
    speakText(`Big ${item.letter}`);
    setSelectedUpper(item);
    if (selectedLower) {
      checkMatch(item, selectedLower);
    }
  };

  const handleLowerClick = (item) => {
    if (matchedLetters.includes(item.letter.toUpperCase()) || wrongMatch) return;
    speakText(`Small ${item.letter}`);
    setSelectedLower(item);
    if (selectedUpper) {
      checkMatch(selectedUpper, item);
    }
  };

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back to Games
        </button>
        <div className="ls-grid-title">🅰️ Letter Match</div>
        <div className="ls-grid-sub">Tap a big letter, then tap the matching small letter!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', gap: '2rem' }}>
        
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 3rem',
          backgroundColor: '#FFF8E1', borderRadius: '50px', border: '4px solid #FFC107',
          color: '#F57F17', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(255, 193, 7, 0.2)'
        }}>
          <div>Score: {score}</div>
        </div>

        {/* Game Columns */}
        <div style={{ display: 'flex', gap: '4rem', width: '100%', maxWidth: '600px', justifyContent: 'center' }}>
          
          {/* Big Letters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '0.5rem' }}>Big Letters</h2>
            {upperPool.map(item => {
              const isMatched = matchedLetters.includes(item.letter);
              const isSelected = selectedUpper?.id === item.id;
              
              let bgColor = '#FFFFFF';
              let borderColor = '#3498DB';
              
              if (isMatched) { bgColor = '#E8F5E9'; borderColor = '#4CAF50'; }
              else if (isSelected) {
                if (wrongMatch) { bgColor = '#FFEBEE'; borderColor = '#F44336'; }
                else { bgColor = '#E3F2FD'; borderColor = '#2196F3'; }
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleUpperClick(item)}
                  style={{
                    width: '100px', height: '100px', fontSize: '3.5rem', fontWeight: 'bold',
                    backgroundColor: bgColor, border: `4px solid ${borderColor}`,
                    color: isMatched ? '#4CAF50' : '#2C3E50',
                    borderRadius: '20px', cursor: isMatched ? 'default' : 'pointer',
                    boxShadow: isMatched ? 'none' : `0 6px 0 ${borderColor}`,
                    transform: isSelected && !wrongMatch ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s', opacity: isMatched ? 0.4 : 1
                  }}
                >
                  {item.letter}
                </button>
              );
            })}
          </div>

          {/* Small Letters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ textAlign: 'center', color: '#2C3E50', marginBottom: '0.5rem' }}>Small Letters</h2>
            {lowerPool.map(item => {
              const isMatched = matchedLetters.includes(item.letter.toUpperCase());
              const isSelected = selectedLower?.id === item.id;
              
              let bgColor = '#FFFFFF';
              let borderColor = '#9B59B6';
              
              if (isMatched) { bgColor = '#E8F5E9'; borderColor = '#4CAF50'; }
              else if (isSelected) {
                if (wrongMatch) { bgColor = '#FFEBEE'; borderColor = '#F44336'; }
                else { bgColor = '#F5EEF8'; borderColor = '#8E44AD'; }
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleLowerClick(item)}
                  style={{
                    width: '100px', height: '100px', fontSize: '3.5rem', fontWeight: 'bold',
                    backgroundColor: bgColor, border: `4px solid ${borderColor}`,
                    color: isMatched ? '#4CAF50' : '#2C3E50',
                    borderRadius: '20px', cursor: isMatched ? 'default' : 'pointer',
                    boxShadow: isMatched ? 'none' : `0 6px 0 ${borderColor}`,
                    transform: isSelected && !wrongMatch ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s', opacity: isMatched ? 0.4 : 1
                  }}
                >
                  {item.letter}
                </button>
              );
            })}
          </div>

        </div>

        {isSuccess && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ color: '#F39C12', fontSize: '2.5rem', fontWeight: 'bold' }}>
              <PartyPopper size={40} style={{ display: 'inline', marginRight: '10px' }} />
              You did it! +{score} XP
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={initLevel} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#3498DB', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 8px 0 #2980B9' }}>
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
    </div>
  );
}
