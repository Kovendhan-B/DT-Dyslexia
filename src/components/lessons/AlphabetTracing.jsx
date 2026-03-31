import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Volume2, RotateCcw, Star, Eraser, PlayCircle, ArrowRight, CheckCircle } from 'lucide-react';

export default function AlphabetTracing({ data, speakText, onBack, onNext, isLast }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  // Hidden hit-detection state
  const targetPixelMapRef = useRef(new Uint8Array(0));
  const canvasRefs = useRef({ w: 0, h: 0, cols: 0, rows: 0 });
  const totalTargetPixelsRef = useRef(0);
  const hitsRef = useRef(new Set());

  // Play instruction on mount
  useEffect(() => {
    speakText(`This is ${data.letter}... ${data.letter} for ${data.word}! Trace the letter.`);
  }, [data]);

  // Handle Canvas Setup and Accurate Hit Detection Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    
    // Set internal resolution matching display size
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 15; // Smooth pencil-like stroke
    ctx.strokeStyle = '#FF4081'; // Pink drawing line

    // Create a hidden canvas to draw the target letter perfectly and create a hit map
    const hidden = document.createElement('canvas');
    hidden.width = rect.width;
    hidden.height = rect.height;
    const hCtx = hidden.getContext('2d', { willReadFrequently: true });
    
    // Match the standard sans-serif font rendering to the SVG text as close as possible
    hCtx.font = 'bold 400px sans-serif'; 
    hCtx.textAlign = 'center';
    hCtx.textBaseline = 'middle';
    
    // Draw thick text to create a generous tolerance zone for children
    hCtx.lineWidth = 50; 
    hCtx.strokeStyle = '#000';
    hCtx.strokeText(data.letter + data.letter.toLowerCase(), hidden.width / 2, hidden.height * 0.6);
    hCtx.fillText(data.letter + data.letter.toLowerCase(), hidden.width / 2, hidden.height * 0.6);

    try {
      const imgData = hCtx.getImageData(0, 0, hidden.width, hidden.height).data;
      
      // We downsample the hitmap into a 10x10 resolution grid to ensure extremely fast O(1) checking
      const gridSize = 10;
      const cols = Math.floor(hidden.width / gridSize);
      const rows = Math.floor(hidden.height / gridSize);
      const grid = new Uint8Array(cols * rows);
      
      let targetCount = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = ((r * gridSize + (gridSize/2)) * hidden.width + (c * gridSize + (gridSize/2)));
          if (imgData[px * 4 + 3] > 0) { // If alpha > 0 (text is there)
            grid[r * cols + c] = 1;
            targetCount++;
          }
        }
      }
      
      targetPixelMapRef.current = grid;
      totalTargetPixelsRef.current = targetCount;
      canvasRefs.current = { w: hidden.width, h: hidden.height, cols, rows, gridSize };
    } catch (e) {
      console.warn('Canvas imageData read failed, fallback to naive tracking', e);
      totalTargetPixelsRef.current = 100;
      targetPixelMapRef.current = new Uint8Array(0);
    }
    
    hitsRef.current = new Set();
    setProgress(0);
  }, [data]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    if (isSuccess || (e.touches && e.touches.length > 1)) return;
    isDrawing.current = true;
    const pos = getPos(e);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    trackCoverage(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current || isSuccess) return;
    e.preventDefault(); // Prevent scrolling
    
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    trackCoverage(pos.x, pos.y);
  };
  
  const trackCoverage = (x, y) => {
    const { cols, rows, gridSize } = canvasRefs.current;
    if (totalTargetPixelsRef.current <= 0 || targetPixelMapRef.current.length === 0) return;
    
    const c = Math.floor(x / gridSize);
    const r = Math.floor(y / gridSize);
    
    // Also check immediate neighbors (brush radius simulation) to make it smooth for kids
    const radius = 2; // Increased radius for much easier hit detection
    for(let i = -radius; i <= radius; i++) {
        for(let j = -radius; j <= radius; j++) {
            const checkC = c + i;
            const checkR = r + j;
            if (checkC >= 0 && checkC < cols && checkR >= 0 && checkR < rows) {
              const idx = checkR * cols + checkC;
              if (targetPixelMapRef.current[idx] === 1 && !hitsRef.current.has(idx)) {
                hitsRef.current.add(idx);
              }
            }
        }
    }
    
    const pct = Math.floor((hitsRef.current.size / totalTargetPixelsRef.current) * 100);
    // Scale so covering just 40% of the true target area reads as 100% progress
    const normalizedPct = Math.min(Math.floor((pct / 40) * 100), 100);
    setProgress(normalizedPct);
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  const handleDone = () => {
    // Check scaled progress bar
    if (progress >= 80) {
      setIsSuccess(true);
      speakText('Great job! You traced it perfectly!');
    } else {
      speakText('Try again 😊. Trace over all the dotted lines!');
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hitsRef.current = new Set();
    setIsSuccess(false);
    setProgress(0);
    speakText('Cleared! Let\'s try again.');
  };

  const replayAnimation = () => {
    clearCanvas();
    speakText('Watch the lines! Trace exactly over them.');
  };

  return (
    <div className="ls-root" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="ls-grid-header">
        <button className="ls-back-btn" onClick={onBack}>
          <ChevronLeft size={20} /> Back to Alphabets
        </button>
        <div className="ls-grid-title">✍️ Let's Trace!</div>
        <div className="ls-grid-sub">Learn to write by drawing over the dotted lines!</div>
      </div>

      {/* Main Split Layout */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem',
        padding: '0 2rem', alignItems: 'stretch', flex: 1
      }}>
        
        {/* Left Side: Detail Info */}
        <div style={{
          flex: '1 1 300px', backgroundColor: '#FFF9C4', borderRadius: '30px',
          padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '4px solid #FBC02D',
          maxWidth: '400px', margin: '0 auto'
        }}>
          <button 
            onClick={() => speakText(data.letter)}
            style={{
              width: '80px', height: '80px', borderRadius: '50%', border: 'none',
              backgroundColor: '#F39C12', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', boxShadow: '0 6px 0 #D68910', marginBottom: '1rem',
              transition: 'transform 0.2s'
            }}
          >
            <Volume2 size={40} />
          </button>
          
          <div style={{ fontSize: '10rem', fontWeight: 'bold', color: '#E65100', lineHeight: 1 }}>
            {data.letter}
            <span style={{ fontSize: '8rem' }}>{data.letter.toLowerCase()}</span>
          </div>

          <div style={{ fontSize: '6rem', margin: '1rem 0', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }}>
            {data.emoji}
          </div>
          
          <div style={{
            fontSize: '3.5rem', fontWeight: 'bold', color: '#4A148C',
            backgroundColor: 'white', padding: '1rem 3rem', borderRadius: '50px',
            border: '4px dashed #9C27B0'
          }}>
            {data.word}
          </div>
        </div>

        {/* Right Side: Tracing Canvas */}
        <div style={{
          flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem',
          alignItems: 'center'
        }}>
          
          {/* Progress & Success Banner */}
          <div style={{
            width: '100%', maxWidth: '600px', display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem', backgroundColor: isSuccess ? '#E8F5E9' : '#E0F7FA',
            borderRadius: '20px', border: isSuccess ? '4px solid #81C784' : '4px solid #4DD0E1',
            transition: 'background-color 0.5s'
          }}>
            <div style={{ fontWeight: 'bold', color: isSuccess ? '#2E7D32' : '#00838F', fontSize: '1.2rem' }}>
              {isSuccess ? '🏆 Great job!' : '✏️ Tracing Progress'}
            </div>
            <div style={{ flex: 1, height: '24px', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.1)' }}>
              <div style={{
                width: `${progress}%`, height: '100%', backgroundColor: isSuccess ? '#4CAF50' : '#00BCD4',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontWeight: 'bold', color: '#00838F' }}>{progress}%</div>
          </div>

          {/* Canvas Wrapper */}
          <div 
            style={{ 
              position: 'relative', width: '100%', maxWidth: '600px',
              aspectRatio: '1', backgroundColor: '#FFFFFF', borderRadius: '30px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '6px solid #E0E0E0',
              overflow: 'hidden', touchAction: 'none' // CRITICAL: prevents scrolling while drawing
            }}
          >
            {/* Background Dotted Letter (SVG Layer) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <text 
                x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" 
                style={{ 
                  fontSize: '400px', fontWeight: 'bold',
                  fill: 'none', stroke: '#BDBDBD', strokeWidth: '15px',
                  strokeDasharray: '25, 25', strokeLinecap: 'round'
                }}
              >
                {data.letter}{data.letter.toLowerCase()}
              </text>
            </svg>

            {/* Drawing Canvas */}
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, cursor: 'crosshair' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
            />

            {/* Success Overlay */}
            {isSuccess && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
                <Star size={200} fill="#FFCA28" color="#FF8F00" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))', animation: 'bounce 1s infinite' }} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginTop: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={clearCanvas}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem',
                borderRadius: '50px', border: 'none', backgroundColor: '#F44336', color: 'white',
                fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #D32F2F',
                transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'translateY(6px)'}
              onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Eraser size={24} /> Clear
            </button>

            <button 
              onClick={replayAnimation}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem',
                borderRadius: '50px', border: 'none', backgroundColor: '#2196F3', color: 'white',
                fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #1976D2',
                transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'translateY(6px)'}
              onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <PlayCircle size={24} /> Replay
            </button>

            {!isSuccess && (
              <button 
                onClick={handleDone}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem',
                  borderRadius: '50px', border: 'none', backgroundColor: '#9C27B0', color: 'white',
                  fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #7B1FA2',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'translateY(6px)'}
                onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <CheckCircle size={24} /> Done
              </button>
            )}
            
            {isSuccess && (
              <button 
                onClick={onNext}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2rem',
                  borderRadius: '50px', border: 'none', backgroundColor: '#4CAF50', color: 'white',
                  fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 #388E3C',
                  transition: 'transform 0.1s', animation: 'bounce 1s infinite'
                }}
              >
                {isLast ? 'Finish!' : 'Next Letter'} <ArrowRight size={24} />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
