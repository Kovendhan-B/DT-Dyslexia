import React, { useState } from 'react';
import { Volume2, ArrowRight, Lock, ChevronLeft } from 'lucide-react';
import { t } from '../i18n/translations';
import { logActivity, logLessonCompleted } from '../services/api';


import PhonicsBasics       from './lessons/PhonicsBasics';
import SimpleWords         from './lessons/SimpleWords';
import SightWords          from './lessons/SightWords';
import WordBuilding        from './lessons/WordBuilding';
import SentenceFormation   from './lessons/SentenceFormation';
import ReadingPractice     from './lessons/ReadingPractice';
import ListeningMatching   from './lessons/ListeningMatching';
import AlphabetTracing     from './lessons/AlphabetTracing';

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

// Lesson categories — titles/descs from translation system
function getLessonCategories(lang) {
  return [
    { id: 'alphabets',    emoji: '🔤', color: '#4A90E2', glowClass: 'ls-cat-glow-blue',   count: alphabetData.length },
    { id: 'numbers',      emoji: '🔢', color: '#F39C12', glowClass: 'ls-cat-glow-amber',  count: numberData.length },
    { id: 'phonics',      emoji: '🗣️', color: '#27AE60', glowClass: 'ls-cat-glow-green',  count: '1 Lesson' },
    { id: 'simplewords',  emoji: '📝', color: '#8E44AD', glowClass: 'ls-cat-glow-purple', count: '1 Lesson' },
    { id: 'sightwords',   emoji: '👁️', color: '#E74C3C', glowClass: 'ls-cat-glow-red',    count: '1 Lesson' },
    { id: 'wordbuilding', emoji: '🏗️', color: '#00BCD4', glowClass: 'ls-cat-glow-cyan',   count: '1 Lesson' },
    { id: 'sentence',     emoji: '🧩', color: '#FF9800', glowClass: 'ls-cat-glow-orange', count: '1 Lesson' },
    { id: 'reading',      emoji: '📖', color: '#009688', glowClass: 'ls-cat-glow-teal',   count: '1 Lesson' },
    { id: 'listening',    emoji: '🎧', color: '#3F51B5', glowClass: 'ls-cat-glow-indigo', count: '1 Lesson' },
  ].map(c => ({
    ...c,
    title: t(lang, `cat_${c.id}`),
    desc:  t(lang, `cat_${c.id}_d`),
  }));
}

export default function Lessons({
  speakText, speechSpeed, setSpeechSpeed, replayAudio, onBack,
  language, progress, persistProgress,
}) {
  const tr = (key) => t(language, key);

  const [activeCategory, setActiveCategory] = useState(null);
  const [viewingIndex,  setViewingIndex]    = useState(null);

  // ── Unlock state from real progress ─────────────────────────────────────
  const unlockedAlpha = progress?.unlockedAlpha ?? 0;
  const unlockedNum   = progress?.unlockedNum   ?? 0;

  // ── Completed lessons from real progress ─────────────────────────────────
  const completedLessons = progress?.lessonsCompleted ?? [];

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat.id);
    speakText(`Let's learn ${cat.title}!`);
  };

  const handleBackToCategories = () => { setActiveCategory(null); setViewingIndex(null); };
  const handleBackToList       = () => { setViewingIndex(null); };

  const handleLessonComplete = (catId = activeCategory) => {
    if (catId && !completedLessons.includes(catId)) {
      const newCompleted = [...completedLessons, catId];
      persistProgress({ lessonsCompleted: newCompleted });
      logLessonCompleted(catId).catch(err => console.error('Failed to log lesson:', err));
      logActivity('lesson_complete', catId).catch(() => {});
      speakText('Awesome! You got a shiny star!');
    }
    setActiveCategory(null);
    setViewingIndex(null);
  };

  // Called by AlphabetTracing when the user successfully traces a letter
  const handleTracingComplete = (accuracyPct) => {
    if (viewingIndex === null) return;
    const letter = alphabetData[viewingIndex]?.letter;
    if (!letter) return;
    // Save per-letter accuracy into progress.lessonAccuracy map
    const currentAccuracy = progress?.lessonAccuracy || {};
    const updated = { ...currentAccuracy, [`alpha_${letter}`]: accuracyPct };
    persistProgress({ lessonAccuracy: updated });
    logActivity('tracing_complete', `${letter}:${accuracyPct}%`).catch(() => {});
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
      speakText(word);
    }
  };

  const handleNext = () => {
    if (activeCategory === 'alphabets') {
      // Unlock next letter only if we're at the current frontier
      const shouldUnlockAlpha = viewingIndex >= unlockedAlpha && unlockedAlpha < alphabetData.length - 1;
      if (shouldUnlockAlpha) {
        const newUnlocked = viewingIndex + 1;
        persistProgress({ unlockedAlpha: newUnlocked });
        logActivity('alphabet_unlocked', alphabetData[newUnlocked].letter).catch(() => {});
      }
      if (viewingIndex < alphabetData.length - 1) {
        const next = viewingIndex + 1;
        setViewingIndex(next);
        const { letter, word } = alphabetData[next];
        setTimeout(() => {
          speakText(shouldUnlockAlpha
            ? `Great job! ${letter} is for ${word}`
            : `${letter} is for ${word}`
          );
        }, 300);
      } else {
        speakText('Wow! You finished all alphabet lessons!');
        handleLessonComplete('alphabets');
      }
    } else {
      // Unlock next number only if we're at the current frontier
      const shouldUnlock = viewingIndex >= unlockedNum && unlockedNum < numberData.length - 1;
      if (shouldUnlock) {
        const newUnlocked = viewingIndex + 1;
        persistProgress({ unlockedNum: newUnlocked });
        logActivity('number_unlocked', numberData[newUnlocked].number).catch(() => {});
      }
      if (viewingIndex < numberData.length - 1) {
        const next = viewingIndex + 1;
        setViewingIndex(next);
        const { number, word } = numberData[next];
        // Single combined utterance — avoids double TTS from chained speakText calls
        setTimeout(() => {
          speakText(shouldUnlock ? `Great job! ${word}` : word);
        }, 300);
      } else {
        speakText('Wow! You finished all number lessons!');
        handleLessonComplete('numbers');
      }
    }
  };

  const playCurrentAudio = () => {
    if (activeCategory === 'alphabets') {
      const { letter, word } = alphabetData[viewingIndex];
      speakText(`${letter} is for ${word}`);
    } else {
      const { word } = numberData[viewingIndex];
      speakText(word);

    }
  };

  // ── External lesson routes ────────────────────────────────────────────────
  if (activeCategory === 'phonics')      return <PhonicsBasics     speakText={speakText} onBack={() => handleLessonComplete('phonics')} />;
  if (activeCategory === 'simplewords')  return <SimpleWords        speakText={speakText} onBack={() => handleLessonComplete('simplewords')} />;
  if (activeCategory === 'sightwords')   return <SightWords         speakText={speakText} onBack={() => handleLessonComplete('sightwords')} />;
  if (activeCategory === 'wordbuilding') return <WordBuilding       speakText={speakText} onBack={() => handleLessonComplete('wordbuilding')} />;
  if (activeCategory === 'sentence')     return <SentenceFormation  speakText={speakText} onBack={() => handleLessonComplete('sentence')} />;
  if (activeCategory === 'reading')      return <ReadingPractice    speakText={speakText} speechSpeed={speechSpeed} onBack={() => handleLessonComplete('reading')} />;
  if (activeCategory === 'listening')    return <ListeningMatching  speakText={speakText} onBack={() => handleLessonComplete('listening')} />;

  // ── Detail card view (AlphabetTracing) ───────────────────────────────────
  if (viewingIndex !== null && activeCategory === 'alphabets') {
    return (
      <AlphabetTracing
        data={alphabetData[viewingIndex]}
        speakText={speakText}
        onBack={handleBackToList}
        onNext={handleNext}
        onComplete={handleTracingComplete}
        isLast={viewingIndex === alphabetData.length - 1}
      />
    );
  }

  // ── Detail card for numbers ───────────────────────────────────────────────
  if (viewingIndex !== null && activeCategory === 'numbers') {
    const item     = numberData[viewingIndex];
    const isLast   = viewingIndex === numberData.length - 1;
    const progress_pct = ((viewingIndex + 1) / numberData.length) * 100;
    return (
      <div className="ls-root">
        <button className="ls-back-btn" onClick={handleBackToList}>
          <ChevronLeft size={20} /> {tr('backTo')} Numbers
        </button>
        <div className="ls-progress-strip">
          <span className="ls-progress-label">{viewingIndex + 1} / {numberData.length}</span>
          <div className="ls-progress-track">
            <div className="ls-progress-fill" style={{ width: `${progress_pct}%` }} />
          </div>
        </div>
        <div className="ls-detail-card">
          <div className="ls-detail-hero">
            <span className="ls-detail-char">{item.number}</span>
            <button className="ls-speak-btn" onClick={playCurrentAudio} aria-label="Speak">
              <Volume2 size={28} />
            </button>
          </div>
          <div className="ls-detail-showcase">
            <div className="ls-detail-big-emoji">{item.emoji}</div>
            <div className="ls-detail-word">{item.word}</div>
            <div className="ls-detail-count">{item.countEmoji}</div>
          </div>
          <button className="ls-next-btn" onClick={handleNext}>
            {isLast ? '🎉 Finish!' : 'Next Number'}
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    );
  }

  // ── View 3 — Grid of items (Alphabets & Numbers) ─────────────────────────
  if (activeCategory === 'alphabets' || activeCategory === 'numbers') {
    const isAlpha         = activeCategory === 'alphabets';
    const dataList        = isAlpha ? alphabetData : numberData;
    const currentUnlocked = isAlpha ? unlockedAlpha : unlockedNum;
    const doneCount       = currentUnlocked + (currentUnlocked < dataList.length ? 1 : 0);
    const pct             = Math.round((doneCount / dataList.length) * 100);

    return (
      <div className="ls-root">
        <div className="ls-grid-header">
          <button className="ls-back-btn" onClick={handleBackToCategories}>
            <ChevronLeft size={20} /> {tr('backToCategories')}
          </button>
          <div className="ls-grid-title">
            {isAlpha ? tr('learnAlphabets') : tr('learnNumbers')}
          </div>
          <div className="ls-grid-sub">{tr('unlockOneByOne')}</div>
        </div>

        <div className="ls-progress-strip">
          <span className="ls-progress-label">{doneCount} / {dataList.length} {tr('unlocked')}</span>
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

  // ── View 1 — Category Selection ───────────────────────────────────────────
  const LESSON_CATEGORIES = getLessonCategories(language);
  return (
    <div className="ls-root">
      <div className="ls-page-header">
        <div className="ls-page-title">{tr('chooseLessonTitle')}</div>
        <div className="ls-page-sub">{tr('chooseLessonSub')}</div>
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
            <div className="ls-cat-badge">{cat.count} {typeof cat.count === 'number' ? tr('lessonSuffix') : ''}</div>
            <div className="ls-cat-cta" style={{ color: cat.color }}>{tr('startLearning')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
