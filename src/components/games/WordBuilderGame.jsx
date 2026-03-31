import React, { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, PartyPopper, Star, Lightbulb } from 'lucide-react';

const WORD_LIST = [
  { word: 'SUN', hint: 'It shines bright in the sky during the day.', emoji: '☀️' },
  { word: 'CAT', hint: 'A furry pet that says meow.', emoji: '🐱' },
  { word: 'DOG', hint: 'A friendly pet that barks.', emoji: '🐶' },
  { word: 'CAR', hint: 'You drive this on the road.', emoji: '🚗' },
  { word: 'HAT', hint: 'You wear this on your head.', emoji: '🎩' }
];

export default function WordBuilderGame({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jumbledLetters, setJumbledLetters] = useState([]);
  const [builtWord, setBuiltWord] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);
  
  const [hintActive, setHintActive] = useState(false);

  useEffect(() => {
    loadLevel(currentIndex);
  }, [currentIndex]);

  const loadLevel = (index) => {
    const targetWord = WORD_LIST[index].word;
    const letters = targetWord.split('');
    // Scramble letters
    const shuffled = letters.map((char, i) => ({ id: `L-${i}`, char, used: false })).sort(() => Math.random() - 0.5);
    
    setJumbledLetters(shuffled);
    setBuiltWord('');
    setIsSuccess(false);
    setHintActive(false);

    speakText(`Spell the word for ${WORD_LIST[index].emoji}`);
  };

  const handleLetterClick = (letterObj, index) => {
    if (isSuccess || letterObj.used) return;

    speakText(letterObj.char);

    const targetWord = WORD_LIST[currentIndex].word;
    const nextExpectedChar = targetWord[builtWord.length];

    if (letterObj.char === nextExpectedChar) {
      setBuiltWord(prev => prev + letterObj.char);
      setHintActive(false); // turn off hint when correct
      
      const newJumbled = [...jumbledLetters];
      newJumbled[index].used = true;
      setJumbledLetters(newJumbled);

      if (builtWord.length + 1 === targetWord.length) {
        setIsSuccess(true);
        const spelledOut = targetWord.split('').join('. ');
        setTimeout(() => speakText(`Awesome! ${spelledOut}. ${targetWord}!`), 500);
      }
    } else {
      speakText('Oops, try a different letter! You can do it.');
    }
  };

  const handleHintClick = () => {
    setHintActive(true);
    speakText(WORD_LIST[currentIndex].hint);
  };

  const handleNext = () => {
    setScore(s => s + 10);
    if (currentIndex < WORD_LIST.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('You are a spelling master! You did all the words!');
      onBack();
    }
  };

  const resetCurrent = () => {
    loadLevel(currentIndex);
  };

  const targetWord = WORD_LIST[currentIndex].word;

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back to Games
        </button>
        <div className="ls-grid-title">🏗️ Word Builder</div>
        <div className="ls-grid-sub">Tap the letters in the right order!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '2rem' }}>
        
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 3rem',
          backgroundColor: '#F3E5F5', borderRadius: '50px', border: '4px solid #AB47BC',
          color: '#6A1B9A', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(171, 71, 188, 0.2)'
        }}>
          <div>Score: {score}</div>
          <div>Level: {currentIndex + 1} / {WORD_LIST.length}</div>
        </div>

        {/* Visual Support (Emoji) */}
        <div style={{ fontSize: '6rem', margin: '1rem 0', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>
          {WORD_LIST[currentIndex].emoji}
        </div>

        {/* Built Word Slots */}
        <div style={{ display: 'flex', gap: '0.8rem', padding: '1rem', backgroundColor: '#EDE7F6', borderRadius: '20px', border: '4px dashed #B39DDB' }}>
          {targetWord.split('').map((char, i) => {
            const isFilled = i < builtWord.length;
            const isNext = i === builtWord.length;
            
            return (
              <div 
                key={`slot-${i}`}
                style={{
                  width: '80px', height: '80px',
                  backgroundColor: isFilled ? '#AB47BC' : (isNext && hintActive ? '#FFFFFF' : '#D1C4E9'),
                  border: isFilled ? 'none' : (isNext && hintActive ? '4px dashed #E91E63' : '4px solid transparent'),
                  borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '3rem', fontWeight: 'bold', color: 'white',
                  boxShadow: isFilled ? '0 4px 10px rgba(171, 71, 188, 0.4)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {isFilled ? char : (isNext && hintActive ? char : '')}
              </div>
            );
          })}
        </div>

        {/* Available Letters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '500px' }}>
          {jumbledLetters.map((letterObj, i) => (
            <button
              key={letterObj.id}
              onClick={() => handleLetterClick(letterObj, i)}
              disabled={letterObj.used}
              style={{
                width: '80px', height: '80px', fontSize: '3rem', fontWeight: 'bold',
                backgroundColor: letterObj.used ? '#F5F5F5' : '#FFFFFF',
                border: letterObj.used ? '4px solid #E0E0E0' : '4px solid #CE93D8',
                color: letterObj.used ? '#BDBDBD' : '#8E24AA',
                borderRadius: '16px', cursor: letterObj.used ? 'default' : 'pointer',
                boxShadow: letterObj.used ? 'none' : '0 6px 0 #BA68C8',
                transform: letterObj.used ? 'scale(0.9)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {letterObj.char}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          {!isSuccess && (
            <>
              <button onClick={handleHintClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#FFCA28', color: '#E65100', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #FFB300', transition: 'transform 0.2s' }}>
                <Lightbulb size={24} /> Get a Hint
              </button>
              {builtWord.length > 0 && (
                <button onClick={resetCurrent} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#90A4AE', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #78909C' }}>
                  <RotateCcw size={24} /> Reset
                </button>
              )}
            </>
          )}

          {isSuccess && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', animation: 'pop-in 0.5s' }}>
              <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 3rem', borderRadius: '50px', border: 'none', backgroundColor: '#AB47BC', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 8px 0 #8E24AA', animation: 'bounce 1s infinite' }}>
                {currentIndex === WORD_LIST.length - 1 ? 'Finish!' : 'Next Word'}
                {!isSuccess && <Star size={24} />}
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
