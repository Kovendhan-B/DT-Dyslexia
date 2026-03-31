import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, ArrowRight } from 'lucide-react';

const BUILD_WORDS = [
  { target: 'BIRD', audio: 'Bird' },
  { target: 'FISH', audio: 'Fish' },
  { target: 'STAR', audio: 'Star' },
  { target: 'MOON', audio: 'Moon' },
  { target: 'TREE', audio: 'Tree' }
];

// Provide some decoy letters
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function WordBuilding({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [options, setOptions] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadLevel(currentIndex);
  }, [currentIndex]);

  const loadLevel = (index) => {
    const word = BUILD_WORDS[index].target;
    setCurrentWord('');
    setIsSuccess(false);

    // Generate options: the letters of the word + some random letters
    const wordLetters = word.split('');
    let randomLetters = [];
    while (randomLetters.length < 4) {
      const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      if (!wordLetters.includes(char) && !randomLetters.includes(char)) {
        randomLetters.push(char);
      }
    }
    
    const combined = [...wordLetters, ...randomLetters].sort(() => Math.random() - 0.5);
    setOptions(combined.map((char, i) => ({ id: i, char, used: false })));
    
    speakText(`Build the word: ${BUILD_WORDS[index].audio}`);
  };

  const handleBlockClick = (blockIndex) => {
    if (isSuccess) return;
    const targetWord = BUILD_WORDS[currentIndex].target;
    const clickedChar = options[blockIndex].char;
    
    const expectedChar = targetWord[currentWord.length];
    
    if (clickedChar === expectedChar) {
      // Correct!
      speakText(clickedChar);
      setCurrentWord(prev => prev + clickedChar);
      
      // Update options so it's disabled (used)
      const newOptions = [...options];
      newOptions[blockIndex].used = true;
      setOptions(newOptions);

      if (currentWord.length + 1 === targetWord.length) {
        setIsSuccess(true);
        setTimeout(() => speakText(`Amazing! You built ${BUILD_WORDS[currentIndex].audio}`), 600);
      }
    } else {
      // Incorrect
      speakText("Oops! Try a different block. You can do it!");
      // Small visual shake could be added here by toggling a class
    }
  };

  const handleNext = () => {
    if (currentIndex < BUILD_WORDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText("You are a master builder! You finished this lesson.");
      onBack();
    }
  };

  const targetWord = BUILD_WORDS[currentIndex].target;

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">🏗️ Word Building</div>
        <div className="ls-grid-sub">Find the next letter to build the word!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '3rem' }}>
        
        {/* Listen Button */}
        <button 
          onClick={() => speakText(`Build the word: ${BUILD_WORDS[currentIndex].audio}`)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            padding: '1rem 2rem', borderRadius: '50px', border: 'none',
            backgroundColor: '#00BCD4', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
            cursor: 'pointer', boxShadow: '0 6px 0 #0097A7', transition: 'transform 0.2s'
          }}
        >
          <Volume2 size={32} /> Hear Word
        </button>

        {/* Building Platform */}
        <div style={{ 
          display: 'flex', gap: '0.5rem', padding: '2rem', 
          backgroundColor: '#E0F7FA', borderRadius: '16px', border: '4px solid #B2EBF2'
        }}>
          {targetWord.split('').map((char, i) => {
            const isFilled = i < currentWord.length;
            const isNext = i === currentWord.length;
            return (
              <div 
                key={`slot-${i}`}
                style={{
                  width: '80px', height: '80px',
                  backgroundColor: isFilled ? '#00BCD4' : (isNext ? '#FFFFFF' : '#E0F7FA'),
                  border: isFilled ? 'none' : (isNext ? '4px dashed #00BCD4' : '4px solid transparent'),
                  borderRadius: '12px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '3rem', fontWeight: 'bold', color: 'white',
                  boxShadow: isFilled ? '0 4px 10px rgba(0, 188, 212, 0.4)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {isFilled ? char : ''}
              </div>
            );
          })}
        </div>

        {/* Available blocks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '600px' }}>
          {options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => handleBlockClick(i)}
              disabled={opt.used}
              style={{
                width: '70px', height: '70px',
                backgroundColor: opt.used ? '#F1F8E9' : '#FFFFFF',
                border: opt.used ? '4px solid #DCEDC8' : '4px solid #AED6F1',
                borderRadius: '12px',
                color: opt.used ? '#AED6F1' : '#2980B9',
                fontSize: '2.5rem', fontWeight: 'bold',
                cursor: opt.used ? 'default' : 'pointer',
                boxShadow: opt.used ? 'none' : '0 6px 0 #7FB3D5',
                transform: opt.used ? 'scale(0.9)' : 'scale(1)',
                transition: 'all 0.2s',
                opacity: opt.used ? 0 : 1 // Hide when used helps focus on remaining items
              }}
            >
              {opt.char}
            </button>
          ))}
        </div>

        {isSuccess && (
          <button 
            onClick={handleNext}
            style={{
              padding: '1rem 2rem', borderRadius: '16px', border: 'none',
              backgroundColor: '#27AE60', color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              boxShadow: '0 6px 0 #1E8449', animation: 'bounce 1s infinite'
            }}
          >
            {currentIndex === BUILD_WORDS.length - 1 ? 'Finish Lesson 🎉' : 'Next Word'} <ArrowRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
