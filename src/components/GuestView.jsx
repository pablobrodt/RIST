import React, { useEffect, useState } from 'react';
import { useGameSync } from '../hooks/useGameSync';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

export default function GuestView() {
  const { gameState } = useGameSync();
  const [dots, setDots] = useState('');
  const { translateText } = useTranslation();

  // Loading animation for waiting state
  useEffect(() => {
    if (!gameState) {
      const interval = setInterval(() => {
        setDots(d => d.length >= 3 ? '' : d + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const navigate = useNavigate();

  useEffect(() => {
    if (gameState && gameState.isFinished) {
      navigate('/result', { state: { isHost: false } });
    }
  }, [gameState, navigate]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-[var(--color-guest-bg)] flex flex-col items-center justify-center p-8 tv-glow font-sans transition-colors">
        <h1 className="text-4xl font-bold mb-4 animate-pulse" style={{ color: 'var(--color-guest-waitingTitle)' }}>
          {translateText('guest.waitingTitle')}{dots}
        </h1>
        <p className="text-[var(--color-guest-textPrimary)] opacity-70">{translateText('guest.waitingSubtitle')}</p>
      </div>
    );
  }

  const currentQ = gameState.questions[gameState.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[var(--color-guest-bg)] flex flex-col items-center justify-center p-8 tv-glow font-sans transition-colors text-[var(--color-guest-textPrimary)]">
      
      {/* Live Indicator */}
      <div className="absolute top-6 left-8 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full animate-pulse bg-[var(--color-guest-liveIndicator)]"></div>
        <span className="uppercase tracking-widest font-bold text-sm text-[var(--color-guest-liveIndicator)]">{translateText('guest.live')}</span>
      </div>
      
      {/* Contestant Status */}
      <div className="absolute top-6 right-8 text-right">
        <p className="text-[var(--color-guest-textPrimary)] opacity-60 text-sm uppercase tracking-wider">{translateText('guest.guestRole')}</p>
        <p className="font-bold text-xl text-[var(--color-guest-textPrimary)]">{gameState.guestName}</p>
      </div>

      <div className="w-full max-w-6xl space-y-12">
        
        {/* Question Panel */}
        <div className="relative w-full border-t-2 border-b-2 bg-[var(--color-guest-panel)] py-12 px-8 flex items-center justify-center shadow-lg transition-colors border-[var(--color-guest-accent)]">
          <div className="absolute top-0 right-0 p-2 text-sm font-bold opacity-70 text-[var(--color-guest-accent)]">
            P{gameState.currentQuestionIndex + 1}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center leading-tight drop-shadow-md text-[var(--color-guest-textPrimary)]">
            {currentQ.question}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-6 px-12">
          {currentQ.shuffledOptions.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isEliminated = gameState.eliminatedOptions.includes(option);
            const isSelected = gameState.selectedOption === option;
            const isCorrect = option === currentQ.correct;
            
            let btnClasses = "flex items-center text-left py-6 px-8 rounded-full border-2 transition-all duration-300 transform scale-100 ";
            let dynamicStyle = {};
            
            if (isEliminated) {
              btnClasses += "option-eliminated opacity-30 bg-black";
            } else if (gameState.isRevealed) {
              // Revealed State
              if (isCorrect) {
                btnClasses += "option-correct z-10 scale-105";
              } else if (isSelected && !isCorrect) {
                btnClasses += "option-wrong";
              } else {
                btnClasses += "opacity-50";
                dynamicStyle = { backgroundColor: 'var(--color-guest-optionBg)', borderColor: 'var(--color-guest-optionBg)' };
              }
            } else {
              // Active State
              if (isSelected) {
                btnClasses += "option-selected";
              } else {
                dynamicStyle = { 
                  backgroundColor: 'var(--color-guest-optionBg)', 
                  borderColor: 'var(--color-guest-accent)'
                };
              }
            }

            return (
              <div key={idx} className={btnClasses} style={dynamicStyle}>
                <span className="font-bold text-3xl mr-6 w-8 text-center text-[var(--color-guest-optionLetter)]">{letter}</span>
                <span className="text-2xl font-semibold tracking-wide flex-grow">{option}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
