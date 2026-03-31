import React, { useState } from 'react';
import { ChevronLeft, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';

const SIGHT_WORDS = [
  { word: 'THE', example: 'The cat is sleeping.' },
  { word: 'IS', example: 'She is happy.' },
  { word: 'IN', example: 'The toy is in the box.' },
  { word: 'ON', example: 'The book is on the table.' },
  { word: 'YOU', example: 'You are a star!' }
];

export default function SightWords({ speakText, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentItem = SIGHT_WORDS[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < SIGHT_WORDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speakText('You finished the Sight Words lesson! Awesome!');
      onBack();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCardClick = () => {
    setFlipped(!flipped);
    if (!flipped) {
      // It flips to show the example
      speakText(currentItem.example);
    } else {
      // It flips back to the word
      speakText(currentItem.word);
    }
  };

  const playWord = (e) => {
    e.stopPropagation();
    speakText(currentItem.word);
  };

  return (
    <div className="ls-root" style={{ height: 'auto', minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">👁️ Sight Words</div>
        <div className="ls-grid-sub">Tap the flashcard to flip it!</div>
      </div>

      <div style={{ padding: '0 2rem', marginTop: '1rem', width: '100%', maxWidth: '600px', margin: '1rem auto' }}>
        <div className="ls-progress-strip" style={{ margin: '0' }}>
          <span className="ls-progress-label">{currentIndex + 1} / {SIGHT_WORDS.length}</span>
          <div className="ls-progress-track">
            <div className="ls-progress-fill" style={{ width: `${((currentIndex + 1) / SIGHT_WORDS.length) * 100}%`, backgroundColor: '#E74C3C' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        
        {/* Flashcard Component */}
        <div 
          onClick={handleCardClick}
          style={{
            width: '320px',
            height: '240px',
            perspective: '1000px',
            cursor: 'pointer',
            margin: '0 auto'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}>
            {/* Front Side */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '6px solid #E74C3C',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(231, 76, 60, 0.2)'
            }}>
              <span style={{ fontSize: '5rem', fontWeight: 'bold', color: '#2C3E50', letterSpacing: '4px' }}>
                {currentItem.word}
              </span>
              <button 
                onClick={playWord}
                style={{
                  position: 'absolute',
                  bottom: '1rem', right: '1rem',
                  backgroundColor: '#E74C3C',
                  border: 'none', color: 'white',
                  borderRadius: '50%', width: '50px', height: '50px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  boxShadow: '0 4px 0 #C0392B', cursor: 'pointer'
                }}
              >
                <Volume2 size={24} />
              </button>
            </div>

            {/* Back Side */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              backgroundColor: '#FDEDEC',
              borderRadius: '24px',
              border: '6px solid #C0392B',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              boxSizing: 'border-box',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(192, 57, 43, 0.3)'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#C0392B', lineHeight: '1.4' }}>
                {currentItem.example}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem' }}>
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              padding: '1rem 2rem',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: currentIndex === 0 ? '#E2E8F0' : '#BDC3C7',
              color: currentIndex === 0 ? '#94A3B8' : '#2C3E50',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              boxShadow: currentIndex === 0 ? 'none' : '0 6px 0 #95A5A6',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={24} /> Prev
          </button>
          <button 
            onClick={handleNext}
            style={{
              padding: '1rem 2rem',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: '#27AE60',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 6px 0 #1E8449',
              transition: 'all 0.2s'
            }}
          >
            {currentIndex === SIGHT_WORDS.length - 1 ? 'Finish!' : 'Next'} <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
