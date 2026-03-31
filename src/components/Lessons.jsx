import React, { useState } from 'react';
import { Volume2, ArrowRight, Lock, ChevronLeft, LayoutGrid } from 'lucide-react';

import PhonicsBasics from './lessons/PhonicsBasics';
import SimpleWords from './lessons/SimpleWords';
import SightWords from './lessons/SightWords';
import WordBuilding from './lessons/WordBuilding';
import SentenceFormation from './lessons/SentenceFormation';
import ReadingPractice from './lessons/ReadingPractice';
import ListeningMatching from './lessons/ListeningMatching';
import AlphabetTracing from './lessons/AlphabetTracing';

const alphabetData = [
  { letter: 'A', word: 'Apple',      emoji: '🍎' },
  { letter: 'B', word: 'Ball',       emoji: '⚽' },
  { letter: 'C', word: 'Cat',        emoji: '🐱' },
  { letter: 'D', word: 'Dog',        emoji: '🐶' },
  { letter: 'E', word: 'Elephant',   emoji: '🐘' },
  { letter: 'F', word: 'Fish',       emoji: '🐟' },
  { letter: 'G', word: 'Grapes',     emoji: '🍇' },
  { letter: 'H', word: 'Hat',        emoji: '🎩' },
  { letter: 'I', word: 'Ice Cream',  emoji: '🍦' },
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

const LESSON_CATEGORIES = [
  { id: 'alphabets', emoji: '🔤', title: 'Alphabets', desc: 'Learn letters A – Z with fun words!', color: '#4A90E2', glowClass: 'ls-cat-glow-blue', count: alphabetData.length },
  { id: 'numbers', emoji: '🔢', title: 'Numbers', desc: 'Count from 1 to 10 with stars!', color: '#F39C12', glowClass: 'ls-cat-glow-amber', count: numberData.length },
  { id: 'phonics', emoji: '🗣️', title: 'Phonics Basics', desc: 'Learn letter sounds!', color: '#27AE60', glowClass: 'ls-cat-glow-green', count: '1 Lesson' },
  { id: 'simplewords', emoji: '📝', title: 'Simple Words', desc: 'Read 2-3 letter words!', color: '#8E44AD', glowClass: 'ls-cat-glow-purple', count: '1 Lesson' },
  { id: 'sightwords', emoji: '👁️', title: 'Sight Words', desc: 'Common words flashcards!', color: '#E74C3C', glowClass: 'ls-cat-glow-red', count: '1 Lesson' },
  { id: 'wordbuilding', emoji: '🏗️', title: 'Word Building', desc: 'Combine letters to build words!', color: '#00BCD4', glowClass: 'ls-cat-glow-cyan', count: '1 Lesson' },
  { id: 'sentence', emoji: '🧩', title: 'Sentences', desc: 'Build simple sentences!', color: '#FF9800', glowClass: 'ls-cat-glow-orange', count: '1 Lesson' },
  { id: 'reading', emoji: '📖', title: 'Reading Practice', desc: 'Read short sentences!', color: '#009688', glowClass: 'ls-cat-glow-teal', count: '1 Lesson' },
  { id: 'listening', emoji: '🎧', title: 'Listening', desc: 'Listen and match images!', color: '#3F51B5', glowClass: 'ls-cat-glow-indigo', count: '1 Lesson' }
];

export default function Lessons({ speakText }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [unlockedAlpha, setUnlockedAlpha] = useState(0);
  const [unlockedNum,   setUnlockedNum]   = useState(0);
  const [viewingIndex,  setViewingIndex]  = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dyslexia_lessons_progress')) || [];
    } catch { return []; }
  });

  const handleSelectCategory = (categoryObj) => {
    setActiveCategory(categoryObj.id);
    speakText(`Let's play ${categoryObj.title}!`);
  };

  const handleBackToCategories = () => { setActiveCategory(null); setViewingIndex(null); };
  const handleBackToList       = () => { setViewingIndex(null); };

  const handleLessonComplete = () => {
    if (activeCategory && !completedLessons.includes(activeCategory)) {
      const newCompleted = [...completedLessons, activeCategory];
      setCompletedLessons(newCompleted);
      localStorage.setItem('dyslexia_lessons_progress', JSON.stringify(newCompleted));
      speakText("Awesome! You got a shiny star!");
    }
    setActiveCategory(null);
    setViewingIndex(null);
  };

  const openLesson = (index, isLocked, category) => {
    if (isLocked) {
      speakText('Oops! This is locked. Finish the ones before it first!');
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

        <div className="ls-cat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', padding: '1rem', paddingBottom: '3rem' }}>
          {LESSON_CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              className={`ls-cat-card ${cat.glowClass}`} 
              onClick={() => handleSelectCategory(cat)}
              style={{ borderTop: `6px solid ${cat.color}`, position: 'relative' }}
            >
              {completedLessons.includes(cat.id) && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>⭐</div>
              )}
              <div className="ls-cat-emoji">{cat.emoji}</div>
              <div className="ls-cat-title">{cat.title}</div>
              <div className="ls-cat-desc">{cat.desc}</div>
              <div className="ls-cat-badge">{cat.count} {typeof cat.count === 'number' ? 'lessons' : ''}</div>
              <div className="ls-cat-cta" style={{ color: cat.color }}>Start Learning →</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     EXTERNAL LESSON ROUTES
  ───────────────────────────────────────────── */
  if (activeCategory === 'phonics') return <PhonicsBasics speakText={speakText} onBack={handleLessonComplete} />;
  if (activeCategory === 'simplewords') return <SimpleWords speakText={speakText} onBack={handleLessonComplete} />;
  if (activeCategory === 'sightwords') return <SightWords speakText={speakText} onBack={handleLessonComplete} />;
  if (activeCategory === 'wordbuilding') return <WordBuilding speakText={speakText} onBack={handleLessonComplete} />;
  if (activeCategory === 'sentence') return <SentenceFormation speakText={speakText} onBack={handleLessonComplete} />;
  if (activeCategory === 'reading') return <ReadingPractice speakText={speakText} speechSpeed={speechSpeed} onBack={handleLessonComplete} />;
  if (activeCategory === 'listening') return <ListeningMatching speakText={speakText} onBack={handleLessonComplete} />;

  /* ─────────────────────────────────────────────
     VIEW 2 — Detail Card (Alphabets & Numbers)
  ───────────────────────────────────────────── */
  if (viewingIndex !== null) {
    const isAlpha    = activeCategory === 'alphabets';

    if (isAlpha) {
      const item = alphabetData[viewingIndex];
      return <AlphabetTracing data={item} speakText={speakText} onBack={handleBackToList} onNext={handleNext} isLast={viewingIndex === alphabetData.length - 1} />;
    }

    const data       = numberData;
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
          <div className="ls-detail-hero">
            <span className="ls-detail-char">
              {isAlpha ? item.letter : item.number}
            </span>
            <button className="ls-speak-btn" onClick={playCurrentAudio} aria-label="Speak">
              <Volume2 size={28} />
            </button>
          </div>

          <div className="ls-detail-showcase">
            <div className="ls-detail-big-emoji">{item.emoji}</div>
            <div className="ls-detail-word">{item.word}</div>
            {!isAlpha && (
              <div className="ls-detail-count">{item.countEmoji}</div>
            )}
          </div>

          <button className="ls-next-btn" onClick={handleNext}>
            {isLast ? '🎉 Finish!' : `Next ${isAlpha ? 'Letter' : 'Number'}`}
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     VIEW 3 — Grid of items (Alphabets & Numbers)
  ───────────────────────────────────────────── */
  const isAlpha        = activeCategory === 'alphabets';
  const dataList       = isAlpha ? alphabetData : numberData;
  const currentUnlocked = isAlpha ? unlockedAlpha : unlockedNum;
  const doneCount      = currentUnlocked + (currentUnlocked < dataList.length ? 1 : 0);
  const pct            = Math.round((doneCount / dataList.length) * 100);

  return (
    <div className="ls-root">
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={handleBackToCategories}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">
          {isAlpha ? '🔤 Learn Alphabets' : '🔢 Learn Numbers'}
        </div>
        <div className="ls-grid-sub">Unlock one by one as you learn!</div>
      </div>

      <div className="ls-progress-strip">
        <span className="ls-progress-label">{doneCount} / {dataList.length} unlocked</span>
        <div className="ls-progress-track">
          <div className="ls-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

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
