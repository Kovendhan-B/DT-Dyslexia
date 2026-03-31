import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, Star, RefreshCcw } from 'lucide-react';

const WORDS_DATA = [
  { word: 'CAT', emoji: '🐱', audio: 'Cat' },
  { word: 'DOG', emoji: '🐶', audio: 'Dog' },
  { word: 'BAT', emoji: '🦇', audio: 'Bat' },
  { word: 'SUN', emoji: '☀️', audio: 'Sun' },
  { word: 'HAT', emoji: '🎩', audio: 'Hat' }
];

export default function SimpleWords({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jumbledLetters, setJumbledLetters] = useState([]);
  const [spelledWord, setSpelledWord] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadWord(currentIndex);
  }, [currentIndex]);

  const loadWord = (index) => {
    const word = WORDS_DATA[index].word;
    const letters = word.split('');
    // Simple shuffle
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setJumbledLetters(shuffled.map((char, i) => ({ id: i, char, used: false })));
    setSpelledWord(Array(word.length).fill(null));
    setIsSuccess(false);
    speakText(`Spell the word ${WORDS_DATA[index].audio}`);
  };

  const handleLetterClick = (jumbledIndex) => {
    if (isSuccess || jumbledLetters[jumbledIndex].used) return;

    // Find first empty slot
    const emptyIndex = spelledWord.findIndex(char => char === null);
    if (emptyIndex === -1) return;

    const newSpelled = [...spelledWord];
    newSpelled[emptyIndex] = jumbledLetters[jumbledIndex].char;
    setSpelledWord(newSpelled);

    const newJumbled = [...jumbledLetters];
    newJumbled[jumbledIndex].used = true;
    setJumbledLetters(newJumbled);

    speakText(jumbledLetters[jumbledIndex].char);

    // Check completion
    if (!newSpelled.includes(null)) {
      const spelledString = newSpelled.join('');
      if (spelledString === WORDS_DATA[currentIndex].word) {
        setIsSuccess(true);
        const wordAudio = WORDS_DATA[currentIndex].audio;
        const spelledOut = wordAudio.split('').join('. ');
        speakText(`Awesome! This is ${wordAudio}. ${spelledOut}. ${wordAudio}!`);
      } else {
        speakText('Oops, try again! You can do it!');
        setTimeout(() => resetWord(), 1000);
      }
    }
  };

  const resetWord = () => {
    const word = WORDS_DATA[currentIndex].word;
    const newJumbled = jumbledLetters.map(l => ({ ...l, used: false }));
    setJumbledLetters(newJumbled);
    setSpelledWord(Array(word.length).fill(null));
    setIsSuccess(false);
  };

  const handleNext = () => {
    if (currentIndex < WORDS_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('You did all the simple words! Great job!');
      onBack();
    }
  };

  const currentWordData = WORDS_DATA[currentIndex];

  return (
    <div className="ls-root">
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">📝 Simple Words</div>
        <div className="ls-grid-sub">Tap the letters to spell the word!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '2rem' }}>
        
        {/* Visual Cue + Audio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '6rem', backgroundColor: '#F8FAFC', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            {currentWordData.emoji}
          </div>
          <button 
            className="tts-button" 
            style={{ width: '60px', height: '60px' }} 
            onClick={() => speakText(`This is a ${currentWordData.audio}`)}
          >
            <Volume2 size={30} />
          </button>
        </div>

        {/* Spelling Slots */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {spelledWord.map((char, i) => (
            <div 
              key={`slot-${i}`}
              style={{
                width: '80px',
                height: '80px',
                border: '4px dashed #8E44AD',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#8E44AD',
                backgroundColor: char ? '#F4ECF7' : 'transparent',
                borderStyle: char ? 'solid' : 'dashed'
              }}
            >
              {char}
            </div>
          ))}
        </div>

        {/* Available Letters */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {jumbledLetters.map((l, i) => (
            <button
              key={l.id}
              onClick={() => handleLetterClick(i)}
              disabled={l.used || isSuccess}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: l.used ? '#E2E8F0' : '#4A90E2',
                color: l.used ? '#94A3B8' : 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                cursor: l.used || isSuccess ? 'not-allowed' : 'pointer',
                boxShadow: l.used ? 'none' : '0 6px 0 #2C6EBE',
                transform: l.used ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              {l.char}
            </button>
          ))}
        </div>

        {/* Controls / Success */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isSuccess ? (
            <button 
              onClick={handleNext}
              className="ls-next-btn"
              style={{ margin: 0 }}
            >
              {currentIndex === WORDS_DATA.length - 1 ? 'Finish Lesson 🎉' : 'Next Word ➡️'}
            </button>
          ) : (
            <button 
              onClick={resetWord}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none',
                backgroundColor: '#F39C12', color: 'white', fontWeight: 'bold',
                cursor: 'pointer', boxShadow: '0 4px 0 #D68910', fontSize: '1.2rem'
              }}
            >
              <RefreshCcw size={20} /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
