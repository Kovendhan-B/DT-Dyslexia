import React, { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Star, CheckCircle, BookOpen, Gamepad2, Brain, Activity, Clock, Award } from 'lucide-react';

export default function ParentsPortal({ onBack }) {
  // Aggregate statistics state
  const [stats, setStats] = useState({
    totalStars: 0,
    lessonsCompleted: 0,
    gamesPlayed: 0,
    testsPassed: 0,
    testsHistory: [],
    recentActivity: []
  });

  useEffect(() => {
    // 1. Gather all local storage data from the child's unified learning flow
    const testProgress = JSON.parse(localStorage.getItem('dyslexia_test_progress') || '[]');
    const testScore = parseInt(localStorage.getItem('dyslexia_test_score') || '0', 10);
    const lessonProgress = JSON.parse(localStorage.getItem('dyslexia_lessons_progress') || '[]');
    const gameScores = JSON.parse(localStorage.getItem('dyslexia_games_scores') || '[]'); // if array
    
    // Simulate robust data if strictly new layout testing is needed, but we rely on their genuine history
    const totalStars = testProgress.length + (gameScores.length ? gameScores.reduce((a, b) => a + (b.score || 1), 0) : 0);
    
    // Create a generic activity timeline from their data
    const activities = [];
    if (lessonProgress.length > 0) activities.push({ title: 'Completed new Lessons', time: 'Recently', icon: BookOpen, color: '#4CAF50' });
    if (gameScores.length > 0) activities.push({ title: 'Played fun Games', time: 'Recently', icon: Gamepad2, color: '#9C27B0' });
    if (testProgress.length > 0) activities.push({ title: `Passed ${testProgress.length} Tests`, time: 'Recently', icon: Star, color: '#FF9800' });
    
    if (activities.length === 0) {
      activities.push({ title: 'Child started adjusting to the App!', time: 'Today', icon: CheckCircle, color: '#2196F3' });
    }

    setStats({
      totalStars: testScore > 0 ? testScore : totalStars,
      lessonsCompleted: lessonProgress.length || 0,
      gamesPlayed: gameScores.length || 0,
      testsPassed: testProgress.length || 0,
      testsHistory: testProgress,
      recentActivity: activities,
    });
  }, []);

  // Simple heuristic analyzers
  const hasAlphabet = stats.testsHistory.includes('alphabet');
  const hasPhonics = stats.testsHistory.includes('phonics');
  const hasSentences = stats.testsHistory.includes('sentence');
  const hasReading = stats.testsHistory.includes('reading');

  const getStrengthInsight = () => {
    if (hasPhonics && hasReading) return 'Exceptional auditory and reading comprehension!';
    if (hasAlphabet) return 'Great start with Letter Recognition and alphabets.';
    if (hasSentences) return 'Strong understanding of sentence structures and word building.';
    return 'Your child is just getting started! Encourage them to play the Alphabet Test.';
  };

  const getRecommendation = () => {
    if (!hasPhonics && hasAlphabet) return 'Practice Phonics sounds to improve letter-sound associations.';
    if (!hasSentences && hasReading) return 'Try the Sentence Formation tests for structural learning.';
    if (!hasReading) return 'Practice tracing and simple reading flashcards.';
    return 'Keep up the momentum! Allow them to explore the Games hub freely.';
  };

  // Skill calculation
  const getSkillLevel = (type) => {
    // Return a percentage based on test mastery
    if (type === 'reading') return hasReading ? 90 : (hasAlphabet ? 40 : 10);
    if (type === 'writing') return stats.lessonsCompleted > 0 ? 80 : 20; // Tracing implies writing
    if (type === 'listening') return hasPhonics ? 85 : 30;
    if (type === 'memory') return stats.gamesPlayed > 0 ? 75 : 15;
    return 0;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1A237E, #3949AB)', padding: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
            <ChevronLeft size={20} /> Back to Student Space
          </button>
          <h1 style={{ fontSize: '2.5rem', margin: '1.5rem 0 0 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <TrendingUp size={36} /> Analytics & Parent Portal
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.8, fontSize: '1.2rem' }}>A private view of your child\'s learning journey.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        
        {/* TOP STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '6px solid #FFC107' }}>
            <div style={{ backgroundColor: '#FFF8E1', padding: '1.5rem', borderRadius: '15px' }}>
              <Star size={32} color="#FFB300" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Score</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>{stats.totalStars} XP</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '6px solid #4CAF50' }}>
            <div style={{ backgroundColor: '#E8F5E9', padding: '1.5rem', borderRadius: '15px' }}>
              <BookOpen size={32} color="#43A047" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Lessons Viewed</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>{stats.lessonsCompleted}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '6px solid #2196F3' }}>
            <div style={{ backgroundColor: '#E3F2FD', padding: '1.5rem', borderRadius: '15px' }}>
              <Award size={32} color="#1E88E5" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Tests Mastered</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>{stats.testsPassed} / 7</div>
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: SKILLS & INSIGHTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          
          {/* Skill Radar / Bars */}
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#333', marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Brain size={28} color="#9C27B0" /> Core Skill Development
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Reading Comprehension', type: 'reading', color: '#E91E63' },
                { label: 'Writing & Tracing', type: 'writing', color: '#00BCD4' },
                { label: 'Auditory & Phonics', type: 'listening', color: '#FF9800' },
                { label: 'Memory & Recall', type: 'memory', color: '#4CAF50' },
              ].map(skill => {
                const val = getSkillLevel(skill.type);
                const desc = val >= 75 ? 'Good' : val >= 40 ? 'Improving' : 'Beginner';
                return (
                  <div key={skill.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>
                      <span>{skill.label}</span>
                      <span style={{ color: skill.color }}>{desc}</span>
                    </div>
                    <div style={{ width: '100%', height: '16px', backgroundColor: '#F5F5F5', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${val}%`, height: '100%', backgroundColor: skill.color, borderRadius: '10px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Insights & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ backgroundColor: 'linear-gradient(135deg, #FFF8E1, #FFECB3)', background: '#FFFDF5', padding: '2rem', borderRadius: '24px', border: '2px solid #FFE082', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#F57C00', marginTop: 0, marginBottom: '1rem' }}>Identified Strengths</h3>
              <p style={{ color: '#555', lineHeight: 1.5, margin: 0 }}>{getStrengthInsight()}</p>
            </div>

            <div style={{ backgroundColor: '#F3E5F5', padding: '2rem', borderRadius: '24px', border: '2px solid #CE93D8', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#8E24AA', marginTop: 0, marginBottom: '1rem' }}>Recommended Focus</h3>
              <p style={{ color: '#555', lineHeight: 1.5, margin: 0 }}>{getRecommendation()}</p>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: TIMELINE */}
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginTop: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Activity size={28} color="#2196F3" /> Recent Activity Timeline
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stats.recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', backgroundColor: '#FAFAFA', borderRadius: '15px', border: '1px solid #EEE' }}>
                <div style={{ backgroundColor: act.color, padding: '1rem', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <act.icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>{act.title}</div>
                  <div style={{ color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' }}>
                    <Clock size={14} /> {act.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
