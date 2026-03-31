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
    { id: 'alphabet',     emoji: '🔠', color: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50, #81C784)' },
    { id: 'phonics',      emoji: '🗣️', color: '#F44336', gradient: 'linear-gradient(135deg, #F44336, #E57373)' },
    { id: 'simplewords',  emoji: '🍎', color: '#2196F3', gradient: 'linear-gradient(135deg, #2196F3, #64B5F6)' },
    { id: 'sightwords',   emoji: '👁️', color: '#9C27B0', gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
    { id: 'wordbuilding', emoji: '🏗️', color: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    { id: 'sentence',     emoji: '🧩', color: '#00BCD4', gradient: 'linear-gradient(135deg, #00BCD4, #4DD0E1)' },
    { id: 'reading',      emoji: '📖', color: '#E91E63', gradient: 'linear-gradient(135deg, #E91E63, #F06292)' },
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

  // ── Real data from progress ─────────────────────────────────────────────
  const testsCompleted = progress?.testsCompleted ?? [];   // [{ id, score, date }]
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
      ? testsCompleted.map(t => t.id === testId ? newEntry : t)  // update best score
      : [...testsCompleted, newEntry];

    persistProgress({
      testsCompleted: newTests,
      totalXP: totalXP + pointsEarned,
    });
    logActivity('test_complete', `${testId}: ${pointsEarned}pts`);
    setActiveTest(null);
  };

  // ── Test routes ────────────────────────────────────────────────────────
  if (activeTest === 'alphabet')     return <AlphabetTest             speakText={speakText} onComplete={(pts) => handleTestComplete('alphabet', pts)}     onBack={() => setActiveTest(null)} />;
  if (activeTest === 'phonics')      return <PhonicsTest              speakText={speakText} onComplete={(pts) => handleTestComplete('phonics', pts)}      onBack={() => setActiveTest(null)} />;
  if (activeTest === 'simplewords')  return <SimpleWordsTest          speakText={speakText} onComplete={(pts) => handleTestComplete('simplewords', pts)}  onBack={() => setActiveTest(null)} />;
  if (activeTest === 'sightwords')   return <SightWordsTest           speakText={speakText} onComplete={(pts) => handleTestComplete('sightwords', pts)}   onBack={() => setActiveTest(null)} />;
  if (activeTest === 'wordbuilding') return <WordBuildingTest         speakText={speakText} onComplete={(pts) => handleTestComplete('wordbuilding', pts)} onBack={() => setActiveTest(null)} />;
  if (activeTest === 'sentence')     return <SentenceTest             speakText={speakText} onComplete={(pts) => handleTestComplete('sentence', pts)}     onBack={() => setActiveTest(null)} />;
  if (activeTest === 'reading')      return <ReadingComprehensionTest speakText={speakText} onComplete={(pts) => handleTestComplete('reading', pts)}      onBack={() => setActiveTest(null)} />;

  const TEST_CATEGORIES = getTestCategories(language);

  return (
    <div className="ls-root" style={{ minHeight: '100vh', backgroundColor: '#FFF5E1', paddingBottom: '3rem' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #FF9800, #FFC107)', padding: '2rem',
        borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px',
        boxShadow: '0 8px 20px rgba(255,152,0,0.2)', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <button className="ls-back-btn" onClick={onBack} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
            <ChevronLeft size={20} /> {tr('backToDashboard')}
          </button>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Trophy size={40} /> {tr('testRoomTitle')}
          </div>
          <div style={{ fontSize: '1.2rem', color: '#FFF3E0', marginTop: '0.5rem' }}>
            {language === 'ta' ? 'உங்களுக்கு தெரிந்ததை காட்டி பதக்கங்கள் பெறுங்கள்!' : 'Show what you know and earn badges!'}
          </div>
        </div>

        {/* Stats */}
        <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderRadius: '20px', display: 'flex', gap: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold' }}>{tr('testXP')}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF9800' }}>{totalXP}</div>
          </div>
          <div style={{ width: '2px', backgroundColor: '#EEE' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold' }}>{tr('badges')}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {badgeCount} <Star size={24} fill="#FFC107" color="#FFB300" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {TEST_CATEGORIES.map((cat) => {
            const completedEntry = testsCompleted.find(tc => tc.id === cat.id);
            const isCompleted    = !!completedEntry;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectTest(cat)}
                style={{
                  width: '320px', padding: '2rem', borderRadius: '30px', border: 'none',
                  background: 'white', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)', position: 'relative',
                  borderTop: `8px solid ${cat.color}`, transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={(e)  => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {isCompleted && (
                  <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#FFEB3B', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <Star size={24} fill="#FF9800" color="#F57C00" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#FF9800' }}>{completedEntry.score}pts</span>
                  </div>
                )}

                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: cat.gradient, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', marginBottom: '1rem', boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}>
                  {cat.emoji}
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', margin: '0 0 0.5rem 0' }}>{cat.title}</h3>
                <p style={{ fontSize: '1.1rem', color: '#666', margin: 0, lineHeight: 1.4 }}>{cat.desc}</p>
                <div style={{ marginTop: '1.5rem', fontWeight: 'bold', color: cat.color, fontSize: '1.1rem' }}>
                  {isCompleted ? tr('playAgain') : tr('startTest')} →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
