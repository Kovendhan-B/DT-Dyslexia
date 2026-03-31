import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { t } from '../i18n/translations';
import { logActivity } from '../services/storage';

import MemoryMatch    from './games/MemoryMatch';
import LetterMatch    from './games/LetterMatch';
import SoundMatch     from './games/SoundMatch';
import WordBuilderGame from './games/WordBuilderGame';
import MissingLetter  from './games/MissingLetter';
import QuickTap       from './games/QuickTap';

function getGameCategories(lang) {
  return [
    { id: 'memory',  emoji: '🧠', color: '#4A90E2', glowClass: 'ls-cat-glow-blue' },
    { id: 'letter',  emoji: '🅰️', color: '#F39C12', glowClass: 'ls-cat-glow-amber' },
    { id: 'sound',   emoji: '🎵', color: '#27AE60', glowClass: 'ls-cat-glow-green' },
    { id: 'builder', emoji: '🏗️', color: '#8E44AD', glowClass: 'ls-cat-glow-purple' },
    { id: 'missing', emoji: '❓', color: '#E74C3C', glowClass: 'ls-cat-glow-red' },
    { id: 'quick',   emoji: '⚡', color: '#00BCD4', glowClass: 'ls-cat-glow-cyan' },
  ].map(g => ({
    ...g,
    title: t(lang, `game_${g.id}`),
    desc:  t(lang, `game_${g.id}_d`),
  }));
}

export default function Games({
  speakText, speechSpeed, setSpeechSpeed, replayAudio, onBack,
  language, progress, persistProgress,
}) {
  const tr = (key) => t(language, key);
  const [activeGame, setActiveGame] = useState(null);

  const completedGames = progress?.gamesCompleted ?? [];

  const handleSelectGame = (gameObj) => {
    setActiveGame(gameObj.id);
    speakText(`Let's play ${gameObj.title}!`);
  };

  const handleGameComplete = () => {
    if (activeGame && !completedGames.includes(activeGame)) {
      const newCompleted = [...completedGames, activeGame];
      persistProgress({ gamesCompleted: newCompleted });
      logActivity('game_complete', activeGame);
      speakText('Awesome! You got a shiny gaming badge!');
    }
    setActiveGame(null);
  };

  // ── Game routes ───────────────────────────────────────────────────────────
  if (activeGame === 'memory')  return <MemoryMatch     speakText={speakText} speechSpeed={speechSpeed} onBack={handleGameComplete} />;
  if (activeGame === 'letter')  return <LetterMatch     speakText={speakText} speechSpeed={speechSpeed} onBack={handleGameComplete} />;
  if (activeGame === 'sound')   return <SoundMatch      speakText={speakText} speechSpeed={speechSpeed} onBack={handleGameComplete} />;
  if (activeGame === 'builder') return <WordBuilderGame speakText={speakText} speechSpeed={speechSpeed} onBack={handleGameComplete} />;
  if (activeGame === 'missing') return <MissingLetter   speakText={speakText} speechSpeed={speechSpeed} onBack={handleGameComplete} />;
  if (activeGame === 'quick')   return <QuickTap        speakText={speakText} speechSpeed={speechSpeed} onBack={handleGameComplete} />;

  const GAME_CATEGORIES = getGameCategories(language);

  return (
    <div className="ls-root">
      <div className="ls-page-header">
        <button className="ls-back-btn" onClick={onBack} style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={20} /> {tr('backToDashboard')}
        </button>
        <div className="ls-page-title">{tr('chooseGameTitle')}</div>
        <div className="ls-page-sub">{tr('chooseGameSub')}</div>
      </div>

      <div className="ls-cat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', padding: '1rem', paddingBottom: '3rem' }}>
        {GAME_CATEGORIES.map(game => (
          <button
            key={game.id}
            className={`ls-cat-card ${game.glowClass}`}
            onClick={() => handleSelectGame(game)}
            style={{ borderTop: `6px solid ${game.color}`, position: 'relative' }}
          >
            {completedGames.includes(game.id) && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🏅</div>
            )}
            <div className="ls-cat-emoji">{game.emoji}</div>
            <div className="ls-cat-title">{game.title}</div>
            <div className="ls-cat-desc">{game.desc}</div>
            <div className="ls-cat-cta" style={{ color: game.color }}>{tr('playNow')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
