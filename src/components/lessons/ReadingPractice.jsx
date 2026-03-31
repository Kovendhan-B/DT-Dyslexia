import React, { useState, useEffect } from 'react';
import { ChevronLeft, Volume2, ArrowRight, Play, Square } from 'lucide-react';

const READING_PRACTICE = [
  "The quick brown fox jumps.",
  "I have a little red wagon.",
  "She likes to play in the sun.",
  "We are going to the park today.",
  "A big yellow bug is on the leaf."
];

export default function ReadingPractice({ speakText, speechSpeed, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Reset everything when switching sentences
    setHighlightIndex(-1);
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentIndex]);

  const handlePlay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setHighlightIndex(-1);

    const sentence = READING_PRACTICE[currentIndex];
    const words = sentence.split(' ');
    
    // We'll use a mocked timing approach for reliable highlighting
    // Speech synthesis onboundary is notoriously buggy across different browsers/OS
    const WORD_DURATION = speechSpeed === 'slow' ? 800 : 450; // ms per word approx
    
    // Speak the text
    speakText(sentence);

    // Highlight words sequentially
    let currWord = 0;
    setHighlightIndex(currWord);
    
    const interval = setInterval(() => {
      currWord++;
      if (currWord >= words.length) {
        clearInterval(interval);
        setHighlightIndex(-1);
        setIsPlaying(false);
      } else {
        setHighlightIndex(currWord);
      }
    }, WORD_DURATION);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setHighlightIndex(-1);
  };

  const handleNext = () => {
    handleStop();
    if (currentIndex < READING_PRACTICE.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('Wonderful reading! You finished this lesson.');
      onBack();
    }
  };

  const currentSentence = READING_PRACTICE[currentIndex];
  const words = currentSentence.split(' ');

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={() => { handleStop(); onBack(); }}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">📖 Reading Practice</div>
        <div className="ls-grid-sub">Listen and follow along!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3rem', gap: '3rem' }}>
        
        {/* Reading Box */}
        <div style={{
          backgroundColor: '#FFFFFF', padding: '3rem', borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0, 150, 136, 0.1)', border: '4px solid #B2DFDB',
          maxWidth: '800px', width: '90%', textAlign: 'center', minHeight: '150px',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', alignItems: 'center'
        }}>
          {words.map((word, i) => {
            const isHighlighted = i === highlightIndex;
            return (
              <span 
                key={i}
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-dyslexia)',
                  color: isHighlighted ? '#D35400' : '#2C3E50',
                  backgroundColor: isHighlighted ? '#FAD7A1' : 'transparent',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  transition: 'all 0.1s ease',
                  transform: isHighlighted ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {!isPlaying ? (
            <button 
              onClick={handlePlay}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 3rem', borderRadius: '50px', border: 'none',
                backgroundColor: '#009688', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
                cursor: 'pointer', boxShadow: '0 6px 0 #00796B', transition: 'transform 0.2s'
              }}
            >
              <Play size={28} /> Start Reading
            </button>
          ) : (
            <button 
              onClick={handleStop}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 3rem', borderRadius: '50px', border: 'none',
                backgroundColor: '#E74C3C', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
                cursor: 'pointer', boxShadow: '0 6px 0 #C0392B', transition: 'transform 0.2s'
              }}
            >
              <Square size={28} /> Stop
            </button>
          )}

          <button 
            onClick={handleNext}
            style={{
              padding: '1rem 2rem', borderRadius: '50px', border: 'none',
              backgroundColor: '#3498DB', color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              boxShadow: '0 6px 0 #2980B9', transition: 'transform 0.2s'
            }}
          >
            Next <ArrowRight size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}
