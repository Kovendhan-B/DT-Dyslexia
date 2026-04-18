import React, { useState } from 'react';
import { ChevronLeft, Trophy, Star } from 'lucide-react';
import { t } from '../i18n/translations';
import { logActivity } from '../services/storage';

import AlphabetTest             from './tests/AlphabetTest';
import PhonicsTest              from './tests/PhonicsTest';
import SimpleWordsTest          from './tests/SimpleWordsTest';
import SightWordsTest           from './tests/SightWordsTest';
import WordBuildingTest         from './tests/WordBuildingTest';
import SentenceTest             from './tests/SentenceTest';
import ReadingComprehensionTest from './tests/ReadingComprehensionTest';

function getTestCategories(lang) {
  return [
    { id: 'alphabet',     emoji: '🔠', color: '#4ade80', glowClass: 'ls-cat-glow-green' },
    { id: 'phonics',      emoji: '🗣️', color: '#f87171', glowClass: 'ls-cat-glow-red' },
    { id: 'simplewords',  emoji: '🍎', color: '#60a5fa', glowClass: 'ls-cat-glow-blue' },
    { id: 'sightwords',   emoji: '👁️', color: '#c084fc', glowClass: 'ls-cat-glow-purple' },
    { id: 'wordbuilding', emoji: '🏗️', color: '#fb923c', glowClass: 'ls-cat-glow-orange' },
    { id: 'sentence',     emoji: '🧩', color: '#67e8f9', glowClass: 'ls-cat-glow-cyan' },
    { id: 'reading',      emoji: '📖', color: '#f472b6', glowClass: 'ls-cat-glow-pink' },
  ].map(c => ({
    ...c,
    title: t(lang, `test_${c.id === 'simplewords' ? 'simple' : c.id === 'sightwords' ? 'sight' : c.id}`),
    desc:  t(lang, `test_${c.id === 'simplewords' ? 'simple' : c.id === 'sightwords' ? 'sight' : c.id}_d`),
  }));
}

export default function Tests({
  speakText, onBack, speechSpeed, language, progress, persistProgress,
}) {
  const tr = (key) => t(language, key);
  const [activeTest, setActiveTest] = useState(null);

  const testsCompleted = progress?.testsCompleted ?? [];
  const totalXP        = progress?.totalXP ?? 0;
  const badgeCount     = testsCompleted.length;

  const handleSelectTest = (test) => {
    setActiveTest(test.id);
    speakText(`Let's start the ${test.title}!`);
  };

  const handleTestComplete = (testId, pointsEarned) => {
    const existing  = testsCompleted.find(t => t.id === testId);
    const newEntry  = { id: testId, score: pointsEarned, date: new Date().toISOString().slice(0, 10) };
    const newTests  = existing
      ? testsCompleted.map(t => t.id === testId ? newEntry : t)
      : [...testsCompleted, newEntry];

    persistProgress({ testsCompleted: newTests, totalXP: totalXP + pointsEarned });
    logActivity('test_complete', `${testId}: ${pointsEarned}pts`);
    setActiveTest(null);
  };

  if (activeTest === 'alphabet')     return <AlphabetTest             speakText={speakText} onComplete={(pts) => handleTestComplete('alphabet', pts)}     onBack={() => setActiveTest(null)} />;
  if (activeTest === 'phonics')      return <PhonicsTest              speakText={speakText} onComplete={(pts) => handleTestComplete('phonics', pts)}      onBack={() => setActiveTest(null)} />;
  if (activeTest === 'simplewords')  return <SimpleWordsTest          speakText={speakText} onComplete={(pts) => handleTestComplete('simplewords', pts)}  onBack={() => setActiveTest(null)} />;
  if (activeTest === 'sightwords')   return <SightWordsTest           speakText={speakText} onComplete={(pts) => handleTestComplete('sightwords', pts)}   onBack={() => setActiveTest(null)} />;
  if (activeTest === 'wordbuilding') return <WordBuildingTest         speakText={speakText} onComplete={(pts) => handleTestComplete('wordbuilding', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'sentence')     return <SentenceTest             speakText={speakText} onComplete={(pts) => handleTestComplete('sentence', pts)}     onBack={() => setActiveTest(null)} />;
  if (activeTest === 'reading')      return <ReadingComprehensionTest speakText={speakText} onComplete={(pts) => handleTestComplete('reading', pts)}      onBack={() => setActiveTest(null)} />;

  const TEST_CATEGORIES = getTestCategories(language);

  return (
    <div className="ls-root">
      {/* Page header */}
      <div className="ls-page-header">
        <button className="ls-back-btn" onClick={onBack} style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={20} /> {tr('backToDashboard')}
        </button>
        <div className="ls-page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
          <Trophy size={26} style={{ color: 'var(--accent-warm)' }} />
          {tr('testRoomTitle')}
        </div>
        <div className="ls-page-sub">
          {language === 'ta' ? 'உங்களுக்கு தெரிந்ததை காட்டி பதக்கங்கள் பெறுங்கள்!' : 'Show what you know and earn badges!'}
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', padding: '0.4rem 1.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-mid)', fontWeight: 700 }}>{tr('testXP')}</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-warm)' }}>{totalXP}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', padding: '0.4rem 1.2rem' }}>
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>{badgeCount}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-mid)', fontWeight: 700 }}>{tr('badges')}</span>
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="ls-cat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', padding: '1rem', paddingBottom: '3rem' }}>
        {TEST_CATEGORIES.map((cat) => {
          const completedEntry = testsCompleted.find(tc => tc.id === cat.id);
          const isCompleted    = !!completedEntry;

          return (
            <button
              key={cat.id}
              className={`ls-cat-card ${cat.glowClass}`}
              onClick={() => handleSelectTest(cat)}
              style={{ borderTop: `4px solid ${cat.color}`, position: 'relative' }}
            >
              {isCompleted && (
                <div style={{ position: 'absolute', top: '10px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fbbf24' }}>{completedEntry.score}pts</span>
                </div>
              )}
              <div className="ls-cat-emoji">{cat.emoji}</div>
              <div className="ls-cat-title">{cat.title}</div>
              <div className="ls-cat-desc">{cat.desc}</div>
              <div className="ls-cat-cta" style={{ color: cat.color }}>
                {isCompleted ? tr('playAgain') : tr('startTest')} →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
