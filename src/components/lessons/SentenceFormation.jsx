import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const SENTENCES = [
  { text: 'I see a cat', audio: 'I see a cat.' },
  { text: 'The sun is hot', audio: 'The sun is hot.' },
  { text: 'Look at the dog', audio: 'Look at the dog.' },
  { text: 'She can run fast', audio: 'She can run fast.' }
];

export default function SentenceFormation({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jumbledWords, setJumbledWords] = useState([]);
  const [builtSentence, setBuiltSentence] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadLevel(currentIndex);
  }, [currentIndex]);

  const loadLevel = (index) => {
    const target = SENTENCES[index].text.split(' ');
    const shuffled = [...target].map((word, i) => ({ id: i, word, used: false })).sort(() => Math.random() - 0.5);
    setJumbledWords(shuffled);
    setBuiltSentence([]);
    setIsSuccess(false);
    speakText(SENTENCES[index].audio);
  };

  const handleWordClick = (wordObj, index) => {
    if (isSuccess || wordObj.used) return;

    speakText(wordObj.word);

    const targetSentenceArr = SENTENCES[currentIndex].text.split(' ');
    const nextExpectedWord = targetSentenceArr[builtSentence.length];

    if (wordObj.word === nextExpectedWord) {
      // Correct!
      setBuiltSentence([...builtSentence, wordObj.word]);
      
      const newJumbled = [...jumbledWords];
      newJumbled[index].used = true;
      setJumbledWords(newJumbled);

      if (builtSentence.length + 1 === targetSentenceArr.length) {
        setIsSuccess(true);
        setTimeout(() => speakText(`Great job! ${SENTENCES[currentIndex].audio}`), 500);
      }
    } else {
      speakText('Oops, try another word. You can do it!');
    }
  };

  const handleNext = () => {
    if (currentIndex < SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('You did all the sentences! Great job!');
      onBack();
    }
  };

  const resetSentence = () => {
    loadLevel(currentIndex);
  };

  const targetArr = SENTENCES[currentIndex].text.split(' ');

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">🧩 Sentence Formation</div>
        <div className="ls-grid-sub">Tap the words in the right order!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '2rem' }}>
        
        {/* Play Audio Button */}
        <button 
          onClick={() => speakText(SENTENCES[currentIndex].audio)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            padding: '1rem 2rem', borderRadius: '50px', border: 'none',
            backgroundColor: '#FF9800', color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
            cursor: 'pointer', boxShadow: '0 6px 0 #E67E22', transition: 'transform 0.2s'
          }}
        >
          <Volume2 size={24} /> Listen to Sentence
        </button>

        {/* Built Sentence Area */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center',
          minHeight: '80px', padding: '1.5rem', border: '4px dashed #FFCA28', borderRadius: '20px', backgroundColor: '#FFF8E1', width: '90%', maxWidth: '800px'
        }}>
          {targetArr.map((word, i) => {
            const isFilled = i < builtSentence.length;
            return (
              <div 
                key={`built-${i}`}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: isFilled ? '#FF9800' : 'transparent',
                  border: isFilled ? 'none' : '2px dashed #FFB300',
                  color: isFilled ? 'white' : 'transparent',
                  borderRadius: '12px',
                  fontWeight: 'bold', fontSize: '1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '60px', boxShadow: isFilled ? '0 4px 10px rgba(255, 152, 0, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {isFilled ? builtSentence[i] : word}
              </div>
            );
          })}
        </div>

        {/* Available Words */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {jumbledWords.map((wordObj, i) => (
            <button
              key={`jumbled-${i}`}
              onClick={() => handleWordClick(wordObj, i)}
              disabled={wordObj.used}
              style={{
                padding: '1rem 2rem',
                backgroundColor: wordObj.used ? '#FFF3E0' : '#FFFFFF',
                border: wordObj.used ? '4px solid #FFE0B2' : '4px solid #FFCC80',
                color: wordObj.used ? '#FFDBCA' : '#E65100',
                borderRadius: '12px',
                fontWeight: 'bold', fontSize: '1.5rem',
                cursor: wordObj.used ? 'default' : 'pointer',
                boxShadow: wordObj.used ? 'none' : '0 6px 0 #FFA726',
                transform: wordObj.used ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.2s'
              }}
            >
              {wordObj.word}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {!isSuccess && builtSentence.length > 0 && (
            <button onClick={resetSentence} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: '#95A5A6', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 #7F8C8D' }}>
              <RotateCcw size={20} /> Reset
            </button>
          )}

          {isSuccess && (
            <button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '16px', border: 'none', backgroundColor: '#27AE60', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #1E8449', animation: 'bounce 1s infinite' }}>
              {currentIndex === SENTENCES.length - 1 ? 'Finish!' : 'Next Sentence'} <ArrowRight size={20} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
