import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

const QUESTIONS = [
  { text: 'The cat is running.', ask: 'What is the cat doing?', right: 'Running', options: ['Sleeping', 'Running', 'Eating'] },
  { text: 'The big dog is happy.', ask: 'How does the dog feel?', right: 'Happy', options: ['Sad', 'Angry', 'Happy'] },
  { text: 'The sun is hot today.', ask: 'What is hot?', right: 'Sun', options: ['Moon', 'Sun', 'Star'] },
  { text: 'Sam has a red car.', ask: 'What color is the car?', right: 'Red', options: ['Blue', 'Red', 'Green'] },
  { text: 'The bird is in the tree.', ask: 'Where is the bird?', right: 'Tree', options: ['House', 'Tree', 'Car'] },
];

export default function ReadingComprehensionTest({ speakText, onComplete, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = QUESTIONS[currentIdx];

  useEffect(() => {
    if (!isDone && currentIdx === 0) {
      speakText('Welcome to Reading Comprehension! Read the sentence and answer the question.');
      setTimeout(playQuestionAudio, 3500);
    } else if (!isDone) {
      playQuestionAudio();
    }
  }, [currentIdx, isDone]);

  const playQuestionAudio = () => {
    const q = QUESTIONS[currentIdx];
    speakText(`${q.text}... ${q.ask}`);
  };

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);

    const correct = opt === q.right;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      speakText(`Correct! ${q.right} is the right answer.`);
    } else {
      speakText(`Oops! That's not it. Listen again 😊`);
    }

    setTimeout(() => {
      if (correct) {
        if (currentIdx === QUESTIONS.length - 1) {
          setIsDone(true);
          speakText('Test complete! Let\'s look at your score.');
        } else {
          setCurrentIdx(c => c + 1);
          setShowFeedback(false);
          setSelectedOpt(null);
        }
      } else {
        setShowFeedback(false);
        setSelectedOpt(null);
      }
    }, 2500);
  };

  const pct = Math.round((currentIdx / QUESTIONS.length) * 100);

  if (isDone) {
    const passed = score >= 40;
    return (
      <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem 4rem', borderRadius: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '6px solid #E91E63' }}>
          <Star size={100} fill={passed ? "#FFC107" : "#E0E0E0"} color={passed ? "#FF9800" : "#9E9E9E"} style={{ animation: passed ? 'bounce 2s infinite' : 'none' }} />
          <h2 style={{ fontSize: '3rem', color: '#C2185B', margin: '1rem 0' }}>Reading Master!</h2>
          <p style={{ fontSize: '1.5rem', color: '#666' }}>Your Score: <strong>{score} / {QUESTIONS.length * 10}</strong></p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setIsDone(false); setShowFeedback(false); setSelectedOpt(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'border: none', backgroundColor: '#00BCD4', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
              <RotateCcw size={20} /> Retry Test
            </button>
            <button onClick={() => onComplete(score)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', borderRadius: '50px', border: 'none', backgroundColor: '#E91E63', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}>
              Claim Reward <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ls-root" style={{ minHeight: '80vh' }}>
      <div className="ls-grid-header" style={{ marginBottom: '1rem' }}>
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Quit Test
        </button>
        <div className="ls-grid-title">📖 Reading Test</div>
        <button className="ls-back-btn" onClick={playQuestionAudio} style={{ backgroundColor: '#E91E63', color: 'white', borderColor: '#C2185B' }}>
          <Volume2 size={20} /> Hear Target
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>Q{currentIdx + 1}</span>
        <div style={{ flex: 1, height: '15px', backgroundColor: '#E0E0E0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#E91E63', transition: 'width 0.3s ease' }} />
        </div>
        <span style={{ fontWeight: 'bold', color: '#666', fontSize: '1.2rem' }}>{score} XP</span>
      </div>

      {/* Question Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', textAlign: 'center', border: '4px solid #FCE4EC' }}>
        
        {/* The Text to Read */}
        <div style={{ backgroundColor: '#F5F5F5', padding: '2rem', borderRadius: '20px', border: '2px solid #E0E0E0', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '3rem', color: '#333', margin: 0, letterSpacing: '2px' }}>"{q.text}"</h2>
        </div>

        {/* The Question */}
        <h3 style={{ fontSize: '2rem', color: '#E91E63', marginBottom: '3rem' }}>{q.ask}</h3>

        {/* Options */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const statusColor = showFeedback && isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : '#FCE4EC';
            const textColor = showFeedback && isSelected ? 'white' : '#C2185B';

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={showFeedback}
                style={{
                  minWidth: '200px', padding: '1rem 2rem', fontSize: '2.5rem', fontWeight: 'bold',
                  backgroundColor: statusColor, color: textColor,
                  border: `4px solid ${showFeedback && isSelected ? statusColor : '#F8BBD0'}`,
                  borderRadius: '24px', cursor: showFeedback ? 'default' : 'pointer',
                  boxShadow: showFeedback && isSelected ? 'none' : '0 8px 0 #F06292',
                  transform: showFeedback && isSelected ? 'translateY(8px)' : 'translateY(0)',
                  transition: 'all 0.2s ease', letterSpacing: '1px'
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>

      </div>
    </div>
  );
}
