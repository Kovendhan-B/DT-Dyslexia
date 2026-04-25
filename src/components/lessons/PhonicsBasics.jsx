import React, { useState } from 'react';
import { ChevronLeft, Volume2 } from 'lucide-react';

const PHONICS_DATA = [
  { letter: 'A', soundText: 'a', example: 'Apple' },
  { letter: 'B', soundText: 'buh', example: 'Ball' },
  { letter: 'C', soundText: 'kuh', example: 'Cat' },
  { letter: 'D', soundText: 'duh', example: 'Dog' },
  { letter: 'E', soundText: 'eh', example: 'Elephant' },
  { letter: 'F', soundText: 'fuh', example: 'Fish' },
  { letter: 'G', soundText: 'guh', example: 'Grapes' },
  { letter: 'H', soundText: 'huh', example: 'Hat' },
  { letter: 'I', soundText: 'ih', example: 'Igloo' },
  { letter: 'J', soundText: 'juh', example: 'Juice' },
  { letter: 'K', soundText: 'kuh', example: 'Kite' },
  { letter: 'L', soundText: 'luh', example: 'Lion' },
  { letter: 'M', soundText: 'mmm', example: 'Monkey' },
  { letter: 'N', soundText: 'nnn', example: 'Nest' },
  { letter: 'O', soundText: 'aw', example: 'Orange' },
  { letter: 'P', soundText: 'puh', example: 'Penguin' },
  { letter: 'Q', soundText: 'kwuh', example: 'Queen' },
  { letter: 'R', soundText: 'rrr', example: 'Rabbit' },
  { letter: 'S', soundText: 'sss', example: 'Sun' },
  { letter: 'T', soundText: 'tuh', example: 'Tree' },
  { letter: 'U', soundText: 'uh', example: 'Umbrella' },
  { letter: 'V', soundText: 'vuh', example: 'Violin' },
  { letter: 'W', soundText: 'wuh', example: 'Water' },
  { letter: 'X', soundText: 'ks', example: 'X-ray' },
  { letter: 'Y', soundText: 'yuh', example: 'Yoyo' },
  { letter: 'Z', soundText: 'zzz', example: 'Zebra' }
];

export default function PhonicsBasics({ speakText, onBack }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const playSound = (index) => {
    setActiveIndex(index);
    const item = PHONICS_DATA[index];
    // We say the letter, then the child-friendly phonetic sound, then the example
    speakText(item.letter);
  };

  return (
    <div className="ls-root">
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">🗣️ Phonics Basics</div>
        <div className="ls-grid-sub">Tap a letter to hear its sound!</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', padding: '2rem 1rem' }}>
        {PHONICS_DATA.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={item.letter}
              onClick={() => playSound(index)}
              style={{
                width: '100px',
                height: '110px',
                borderRadius: '16px',
                border: isActive ? '4px solid #27AE60' : '4px solid #E0E7FF',
                backgroundColor: isActive ? '#E8F8F5' : '#FFFFFF',
                boxShadow: isActive ? '0 8px 15px rgba(39, 174, 96, 0.3)' : '0 4px 10px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: isActive ? '#27AE60' : '#2B2D42', lineHeight: '1' }}>
                {item.letter}
              </div>
              <div style={{ marginTop: '0.5rem', color: '#8E44AD', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                <Volume2 size={16} /> <span>{item.soundText}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
