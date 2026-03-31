import React, { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, PartyPopper, Star } from 'lucide-react';

const WORD_IMAGE_PAIRS = [
  { word: 'Cat', emoji: '🐱' },
  { word: 'Dog', emoji: '🐶' },
  { word: 'Sun', emoji: '☀️' },
  { word: 'Car', emoji: '🚗' },
  { word: 'Bird', emoji: '🐦' },
  { word: 'Fish', emoji: '🐟' },
  { word: 'Tree', emoji: '🌳' },
  { word: 'Star', emoji: '⭐' },
];

export default function MemoryMatch({ speakText, onBack }) {
  const [level, setLevel] = useState(null); // 'easy'|'medium'|'hard'
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  const initLevel = (selectedLevel) => {
    let pairCount = 2; // easy limit
    if (selectedLevel === 'medium') pairCount = 4;
    if (selectedLevel === 'hard') pairCount = 6;

    setLevel(selectedLevel);
    
    // Pick random pairs up to pairCount
    const selectedPairs = [...WORD_IMAGE_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
    
    // Create deck: Each pair becomes 2 cards (one word, one emoji)
    let deck = [];
    selectedPairs.forEach(p => {
      deck.push({ word: p.word, display: p.word, type: 'word' });
      deck.push({ word: p.word, display: p.emoji, type: 'emoji' });
    });

    const shuffled = deck.sort(() => Math.random() - 0.5).map((item, i) => ({ ...item, id: i }));
    
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setIsSuccess(false);
    setMoves(0);
    setScore(0);
    speakText("Match the word with the picture! Tap two cards.");
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2) return; // Wait
    if (flippedIndices.includes(index) || matchedPairs.includes(cards[index].word)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Speak content
    const clickedCard = cards[index];
    if (clickedCard.type === 'word') {
      speakText(clickedCard.word);
    }

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
        // Matched!
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstCard.word]);
          setFlippedIndices([]);
          setScore(s => s + 10);
          speakText('Awesome match!');
          
          if (matchedPairs.length + 1 === cards.length / 2) {
            setIsSuccess(true);
            setTimeout(() => speakText('You did it! Great job!'), 600);
          }
        }, 500);
      } else {
        // No Match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  const getGridCols = () => {
    if (level === 'easy') return 'repeat(2, 1fr)';
    if (level === 'medium') return 'repeat(4, 1fr)';
    return 'repeat(4, 1fr)';
  };

  if (!level) {
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="ls-page-header" style={{ width: '100%' }}>
          <button className="ls-back-btn" onClick={onBack} style={{ marginBottom: '1rem' }}>
            <ChevronLeft size={20} /> Back to Games
          </button>
          <div className="ls-page-title">🧠 Memory Match</div>
          <div className="ls-page-sub">Choose a level to start!</div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
          <button onClick={() => initLevel('easy')} className="game-btn level-easy" style={{ backgroundColor: '#2ECC71', color: 'white', padding: '1.5rem 3rem', borderRadius: '20px', fontSize: '2rem', fontWeight: 'bold', border: 'none', boxShadow: '0 8px 0 #27AE60', cursor: 'pointer', transition: 'transform 0.2s' }}>
            😊 Easy
          </button>
          <button onClick={() => initLevel('medium')} className="game-btn level-medium" style={{ backgroundColor: '#F39C12', color: 'white', padding: '1.5rem 3rem', borderRadius: '20px', fontSize: '2rem', fontWeight: 'bold', border: 'none', boxShadow: '0 8px 0 #D68910', cursor: 'pointer', transition: 'transform 0.2s' }}>
            😎 Medium
          </button>
          <button onClick={() => initLevel('hard')} className="game-btn level-hard" style={{ backgroundColor: '#E74C3C', color: 'white', padding: '1.5rem 3rem', borderRadius: '20px', fontSize: '2rem', fontWeight: 'bold', border: 'none', boxShadow: '0 8px 0 #C0392B', cursor: 'pointer', transition: 'transform 0.2s' }}>
            🚀 Hard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={() => setLevel(null)}>
          <ChevronLeft size={20} /> Levels
        </button>
        <div className="ls-grid-title" style={{ textTransform: 'capitalize' }}>🧠 Memory Match - {level}</div>
        <div className="ls-grid-sub">Find the matching word and picture pairs!</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', gap: '1.5rem' }}>
        
        {/* Game Stats */}
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 3rem',
          backgroundColor: '#FFF9C4', borderRadius: '50px', border: '4px solid #FBC02D',
          color: '#F57F17', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(251, 192, 45, 0.2)'
        }}>
          <div>Score: {score}</div>
          <div>Moves: {moves}</div>
        </div>

        {/* Board */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: getGridCols(), gap: '1rem',
          maxWidth: '800px', width: '100%', padding: '1rem',
          perspective: '1000px'
        }}>
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.word);
            const isMatched = matchedPairs.includes(card.word);
            
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: '140px', cursor: isMatched ? 'default' : 'pointer',
                  transform: isFlipped ? 'rotateY(0)' : 'rotateY(0)'
                }}
              >
                <div style={{
                  width: '100%', height: '100%',
                  position: 'relative', transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                  {/* Card Back (Unflipped State) */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    backgroundColor: '#4A90E2', borderRadius: '20px', border: '5px solid #2980B9',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    boxShadow: '0 6px 0 #2471A3'
                  }}>
                    <span style={{ fontSize: '3.5rem', color: 'rgba(255,255,255,0.7)' }}>❓</span>
                  </div>

                  {/* Card Front (Flipped State) */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    backgroundColor: isMatched ? '#E8F5E9' : '#FFFFFF', 
                    borderRadius: '20px', border: isMatched ? '5px solid #81C784' : '5px solid #5DADE2',
                    transform: 'rotateY(180deg)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    boxShadow: isMatched ? 'none' : '0 6px 15px rgba(41, 128, 185, 0.2)'
                  }}>
                    <span style={{ 
                      fontSize: card.type === 'emoji' ? '4.5rem' : '2.5rem',
                      fontWeight: 'bold', color: '#154360', textAlign: 'center'
                    }}>
                      {card.display}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isSuccess && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ color: '#F39C12', fontSize: '2.5rem', fontWeight: 'bold' }}>
              <PartyPopper size={40} style={{ display: 'inline', marginRight: '10px' }} />
              You did it! +{score} XP
            </div>
            <button 
              onClick={onBack}
              style={{
                padding: '1.2rem 3rem', borderRadius: '50px', border: 'none',
                backgroundColor: '#F39C12', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer',
                boxShadow: '0 8px 0 #D68910', transition: 'transform 0.2s', marginTop: '1rem'
              }}
            >
              <Star size={28} /> Collect Reward
            </button>
          </div>
        )}

      </div>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .game-btn:active {
          transform: translateY(8px);
          box-shadow: 0 0px 0 transparent !important;
        }
      `}</style>
    </div>
  );
}
