import React, { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, PartyPopper } from 'lucide-react';

const PAIRS = [
  { word: 'Cat', emoji: '🐱', type: 'word' },
  { word: 'Cat', emoji: '🐱', type: 'emoji' },
  { word: 'Dog', emoji: '🐶', type: 'word' },
  { word: 'Dog', emoji: '🐶', type: 'emoji' },
  { word: 'Sun', emoji: '☀️', type: 'word' },
  { word: 'Sun', emoji: '☀️', type: 'emoji' },
  { word: 'Car', emoji: '🚗', type: 'word' },
  { word: 'Car', emoji: '🚗', type: 'emoji' },
];

export default function FunLearningGames({ speakText, onBack }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = [...PAIRS].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((item, i) => ({ ...item, id: i })));
    setFlippedIndices([]);
    setMatchedPairs([]);
    setIsSuccess(false);
    setMoves(0);
    speakText("Match the word with the picture!");
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2) return; // Prevent clicking more than 2
    if (flippedIndices.includes(index) || matchedPairs.includes(cards[index].word)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Speak the card content
    const clickedCard = cards[index];
    speakText(clickedCard.word);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
        // Matched
        setMatchedPairs([...matchedPairs, firstCard.word]);
        setFlippedIndices([]);
        speakText('Match!');
        
        if (matchedPairs.length + 1 === PAIRS.length / 2) {
          setIsSuccess(true);
          setTimeout(() => speakText('You won! Excellent memory!'), 500);
        }
      } else {
        // No Match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Categories
        </button>
        <div className="ls-grid-title">🎮 Memory Match</div>
        <div className="ls-grid-sub">Find the matching word and picture pairs.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', gap: '2rem' }}>
        
        {/* Game Stats */}
        <div style={{
          display: 'flex', gap: '2rem', padding: '1rem 2rem',
          backgroundColor: '#FCE4EC', borderRadius: '50px', border: '3px solid #F48FB1',
          color: '#C2185B', fontWeight: 'bold', fontSize: '1.2rem'
        }}>
          <div>Moves: {moves}</div>
          <div>Matches: {matchedPairs.length} / {PAIRS.length / 2}</div>
        </div>

        {/* Board */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
          maxWidth: '600px', width: '100%', padding: '1rem'
        }}>
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.word);
            const isMatched = matchedPairs.includes(card.word);
            
            return (
              <div 
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: '120px', perspective: '1000px', cursor: isMatched ? 'default' : 'pointer'
                }}
              >
                <div style={{
                  width: '100%', height: '100%',
                  position: 'relative', transition: 'transform 0.5s',
                  transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>
                  {/* Card Back (Unflipped State) */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    backgroundColor: '#EC407A', borderRadius: '16px', border: '4px solid #D81B60',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    boxShadow: '0 6px 0 #C2185B'
                  }}>
                    <span style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.5)' }}>❓</span>
                  </div>

                  {/* Card Front (Flipped State) */}
                  <div style={{
                    position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                    backgroundColor: isMatched ? '#E8F5E9' : '#FFFFFF', 
                    borderRadius: '16px', border: isMatched ? '4px solid #81C784' : '4px solid #F48FB1',
                    transform: 'rotateY(180deg)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    boxShadow: isMatched ? 'none' : '0 6px 15px rgba(233, 30, 99, 0.2)'
                  }}>
                    <span style={{ 
                      fontSize: card.type === 'emoji' ? '4rem' : '2rem',
                      fontWeight: 'bold', color: '#880E4F'
                    }}>
                      {card.type === 'emoji' ? card.emoji : card.word}
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
            <div style={{ color: '#E91E63', fontSize: '2rem', fontWeight: 'bold' }}>
              <PartyPopper size={32} style={{ display: 'inline', marginRight: '10px' }} />
              You did it!
            </div>
            <button 
              onClick={initGame}
              style={{
                padding: '1rem 3rem', borderRadius: '50px', border: 'none',
                backgroundColor: '#E91E63', color: 'white', fontWeight: 'bold', fontSize: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer',
                boxShadow: '0 8px 0 #C2185B', transition: 'transform 0.2s', marginTop: '1rem'
              }}
            >
              <RotateCcw size={28} /> Play Again
            </button>
          </div>
        )}

      </div>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
