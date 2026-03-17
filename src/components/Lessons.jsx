import React, { useState } from 'react';
import { Volume2, ArrowRight, Lock, ChevronLeft } from 'lucide-react';

const alphabetData = [
  { letter: 'A', word: 'Apple',      emoji: '🍎' },
  { letter: 'B', word: 'Ball',       emoji: '⚽' },
  { letter: 'C', word: 'Cat',        emoji: '🐱' },
  { letter: 'D', word: 'Dog',        emoji: '🐶' },
  { letter: 'E', word: 'Elephant',   emoji: '🐘' },
  { letter: 'F', word: 'Fish',       emoji: '🐟' },
  { letter: 'G', word: 'Grapes',     emoji: '🍇' },
  { letter: 'H', word: 'Hat',        emoji: '🎩' },
  { letter: 'J', word: 'Juice',      emoji: '🧃' },
  { letter: 'K', word: 'Kite',       emoji: '🪁' },
  { letter: 'L', word: 'Lion',       emoji: '🦁' },
  { letter: 'M', word: 'Monkey',     emoji: '🐒' },
  { letter: 'N', word: 'Nest',       emoji: '🪹' },
  { letter: 'O', word: 'Orange',     emoji: '🍊' },
  { letter: 'P', word: 'Penguin',    emoji: '🐧' },
  { letter: 'Q', word: 'Queen',      emoji: '👑' },
  { letter: 'R', word: 'Rabbit',     emoji: '🐰' },
  { letter: 'S', word: 'Sun',        emoji: '☀️' },
  { letter: 'T', word: 'Tree',       emoji: '🌳' },
  { letter: 'U', word: 'Umbrella',   emoji: '☂️' },
  { letter: 'V', word: 'Violin',     emoji: '🎻' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉' },
  { letter: 'X', word: 'Xylophone',  emoji: '🎹' },
  { letter: 'Y', word: 'Yoyo',       emoji: '🪀' },
  { letter: 'Z', word: 'Zebra',      emoji: '🦓' },
];

const numberData = [
  { number: '1',  word: 'One',   emoji: '1️⃣', countEmoji: '⭐' },
  { number: '2',  word: 'Two',   emoji: '2️⃣', countEmoji: '⭐⭐' },
  { number: '3',  word: 'Three', emoji: '3️⃣', countEmoji: '⭐⭐⭐' },
  { number: '4',  word: 'Four',  emoji: '4️⃣', countEmoji: '⭐⭐⭐⭐' },
  { number: '5',  word: 'Five',  emoji: '5️⃣', countEmoji: '⭐⭐⭐⭐⭐' },
  { number: '6',  word: 'Six',   emoji: '6️⃣', countEmoji: '⭐⭐⭐⭐⭐⭐' },
  { number: '7',  word: 'Seven', emoji: '7️⃣', countEmoji: '⭐⭐⭐⭐⭐⭐⭐' },
  { number: '8',  word: 'Eight', emoji: '8️⃣', countEmoji: '⭐⭐⭐⭐⭐⭐⭐⭐' },
  { number: '9',  word: 'Nine',  emoji: '9️⃣', countEmoji: '⭐⭐⭐⭐⭐⭐⭐⭐⭐' },
  { number: '10', word: 'Ten',   emoji: '🔟', countEmoji: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐' },
];

export default function Lessons({ speakText }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [unlockedAlpha, setUnlockedAlpha] = useState(0);
  const [unlockedNum,   setUnlockedNum]   = useState(0);
  const [viewingIndex,  setViewingIndex]  = useState(null);

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    speakText(`Let's learn ${category}!`);
  };

  const handleBackToCategories = () => { setActiveCategory(null); setViewingIndex(null); };
  const handleBackToList       = () => { setViewingIndex(null); };

  const openLesson = (index, isLocked, category) => {
    if (isLocked) {
      speakText('This lesson is locked. Finish the previous ones first!');
      return;
    }
    setViewingIndex(index);
    if (category === 'alphabets') {
      const { letter, word } = alphabetData[index];
      speakText(`${letter} is for ${word}`);
    } else {
      const { number, word } = numberData[index];
      speakText(`${number}. ${word}.`);
    }
  };

  const handleNext = () => {
    if (activeCategory === 'alphabets') {
      if (viewingIndex === unlockedAlpha && unlockedAlpha < alphabetData.length - 1) {
        setUnlockedAlpha(unlockedAlpha + 1);
        speakText('Great job! You unlocked the next letter!');
      }
      if (viewingIndex < alphabetData.length - 1) {
        const next = viewingIndex + 1;
        setViewingIndex(next);
        setTimeout(() => { const { letter, word } = alphabetData[next]; speakText(`${letter} is for ${word}`); }, 400);
      } else {
        speakText('Wow! You finished all alphabet lessons!');
        setViewingIndex(null);
      }
    } else {
      if (viewingIndex === unlockedNum && unlockedNum < numberData.length - 1) {
        setUnlockedNum(unlockedNum + 1);
        speakText('Great job! You unlocked the next number!');
      }
      if (viewingIndex < numberData.length - 1) {
        const next = viewingIndex + 1;
        setViewingIndex(next);
        setTimeout(() => { const { number, word } = numberData[next]; speakText(`${number}. ${word}.`); }, 400);
      } else {
        speakText('Wow! You finished all number lessons!');
        setViewingIndex(null);
      }
    }
  };

  const playCurrentAudio = () => {
    if (activeCategory === 'alphabets') {
      const { letter, word } = alphabetData[viewingIndex];
      speakText(`${letter} is for ${word}`);
    } else {
      const { number, word } = numberData[viewingIndex];
      speakText(`${number}. ${word}.`);
    }
  };

  /* ─────────────────────────────────────────────
     VIEW 1 — Category Selection
  ───────────────────────────────────────────── */
  if (!activeCategory) {
    return (
      <div className="ls-root">
        <div className="ls-page-header">
          <div className="ls-page-title">📚 Choose a Lesson</div>
          <div className="ls-page-sub">What would you like to explore today?</div>
        </div>

        <div className="ls-cat-grid">
          {/* Alphabets card */}
          <button className="ls-cat-card ls-cat-alpha" onClick={() => handleSelectCategory('alphabets')}>
            <div className="ls-cat-glow-ring ls-cat-glow-blue" />
            <div className="ls-cat-emoji">🔤</div>
            <div className="ls-cat-title">Alphabets</div>
            <div className="ls-cat-desc">Learn letters A – Z with fun words!</div>
            <div className="ls-cat-badge">{alphabetData.length} lessons</div>
            <div className="ls-cat-cta">Start Learning →</div>
          </button>

          {/* Numbers card */}
          <button className="ls-cat-card ls-cat-num" onClick={() => handleSelectCategory('numbers')}>
            <div className="ls-cat-glow-ring ls-cat-glow-amber" />
            <div className="ls-cat-emoji">🔢</div>
            <div className="ls-cat-title">Numbers</div>
            <div className="ls-cat-desc">Count from 1 to 10 with stars!</div>
            <div className="ls-cat-badge">{numberData.length} lessons</div>
            <div className="ls-cat-cta">Start Counting →</div>
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     VIEW 2 — Detail Card
  ───────────────────────────────────────────── */
  if (viewingIndex !== null) {
    const isAlpha    = activeCategory === 'alphabets';
    const data       = isAlpha ? alphabetData : numberData;
    const item       = data[viewingIndex];
    const isLast     = viewingIndex === data.length - 1;
    const progress   = ((viewingIndex + 1) / data.length) * 100;

    return (
      <div className="ls-root">
        {/* Back button */}
        <button className="ls-back-btn" onClick={handleBackToList}>
          <ChevronLeft size={20} />
          Back to {isAlpha ? 'Alphabets' : 'Numbers'}
        </button>

        {/* Progress strip */}
        <div className="ls-progress-strip">
          <span className="ls-progress-label">{viewingIndex + 1} / {data.length}</span>
          <div className="ls-progress-track">
            <div className="ls-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Main card */}
        <div className="ls-detail-card">
          {/* Big letter / number */}
          <div className="ls-detail-hero">
            <span className="ls-detail-char">
              {isAlpha ? item.letter : item.number}
            </span>
            <button className="ls-speak-btn" onClick={playCurrentAudio} aria-label="Speak">
              <Volume2 size={28} />
            </button>
          </div>

          {/* Emoji + word */}
          <div className="ls-detail-showcase">
            <div className="ls-detail-big-emoji">{item.emoji}</div>
            <div className="ls-detail-word">{item.word}</div>
            {!isAlpha && (
              <div className="ls-detail-count">{item.countEmoji}</div>
            )}
          </div>

          {/* Next / Finish */}
          <button className="ls-next-btn" onClick={handleNext}>
            {isLast ? '🎉 Finish!' : `Next ${isAlpha ? 'Letter' : 'Number'}`}
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     VIEW 3 — Grid of items
  ───────────────────────────────────────────── */
  const isAlpha        = activeCategory === 'alphabets';
  const dataList       = isAlpha ? alphabetData : numberData;
  const currentUnlocked = isAlpha ? unlockedAlpha : unlockedNum;
  const doneCount      = currentUnlocked + (currentUnlocked < dataList.length ? 1 : 0);
  const pct            = Math.round((doneCount / dataList.length) * 100);

  return (
    <div className="ls-root">
      {/* Header */}
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={handleBackToCategories}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">
          {isAlpha ? '🔤 Learn Alphabets' : '🔢 Learn Numbers'}
        </div>
        <div className="ls-grid-sub">Unlock one by one as you learn!</div>
      </div>

      {/* Progress */}
      <div className="ls-progress-strip">
        <span className="ls-progress-label">{doneCount} / {dataList.length} unlocked</span>
        <div className="ls-progress-track">
          <div className="ls-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Grid */}
      <div className={`ls-grid ${isAlpha ? 'ls-grid-alpha' : 'ls-grid-num'}`}>
        {dataList.map((item, index) => {
          const locked    = index > currentUnlocked;
          const completed = index < currentUnlocked;
          const current   = index === currentUnlocked;
          return (
            <button
              key={index}
              className={`ls-grid-tile ${locked ? 'ls-tile-locked' : ''} ${completed ? 'ls-tile-done' : ''} ${current ? 'ls-tile-current' : ''}`}
              onClick={() => openLesson(index, locked, activeCategory)}
              title={locked ? 'Locked — finish previous lessons first' : isAlpha ? item.letter : item.number}
            >
              {locked ? (
                <Lock size={18} className="ls-lock-icon" />
              ) : (
                <>
                  <span className="ls-tile-char">{isAlpha ? item.letter : item.number}</span>
                  {completed && <span className="ls-tile-star">⭐</span>}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
