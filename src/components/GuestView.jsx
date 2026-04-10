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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 tv-glow font-sans">
        <h1 className="text-4xl text-sky-400 font-bold mb-4 animate-pulse">
          {translateText('guest.waitingTitle')}{dots}
        </h1>
        <p className="text-slate-500">{translateText('guest.waitingSubtitle')}</p>
      </div>
    );
  }

  const currentQ = gameState.questions[gameState.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 tv-glow font-sans">
      
      {/* Live Indicator */}
      <div className="absolute top-6 left-8 flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-red-500 uppercase tracking-widest font-bold text-sm">{translateText('guest.live')}</span>
      </div>
      
      {/* Contestant Status */}
      <div className="absolute top-6 right-8 text-right">
        <p className="text-slate-400 text-sm uppercase tracking-wider">{translateText('guest.guestRole')}</p>
        <p className="text-white font-bold text-xl">{gameState.guestName}</p>
      </div>

      <div className="w-full max-w-6xl space-y-12">
        
        {/* Question Panel */}
        <div className="relative w-full border-t-2 border-b-2 border-sky-400 bg-slate-900/80 backdrop-blur-sm py-12 px-8 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <div className="absolute top-0 right-0 p-2 text-sky-400 text-sm font-bold opacity-50">
            P{gameState.currentQuestionIndex + 1}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center leading-tight drop-shadow-md">
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
            
            if (isEliminated) {
              btnClasses += "option-eliminated border-slate-700 bg-slate-900";
            } else if (gameState.isRevealed) {
              // Revealed State
              if (isCorrect) {
                btnClasses += "option-correct text-white z-10 scale-105";
              } else if (isSelected && !isCorrect) {
                btnClasses += "option-wrong text-white";
              } else {
                btnClasses += "border-slate-700 bg-slate-900 text-slate-400 opacity-50";
              }
            } else {
              // Active State
              if (isSelected) {
                btnClasses += "option-selected text-white";
              } else {
                btnClasses += "border-sky-500 bg-slate-900/50 text-white hover:bg-slate-800 shadow-[0_0_10px_rgba(14,165,233,0.3)]";
              }
            }

            return (
              <div key={idx} className={btnClasses}>
                <span className="text-amber-500 font-bold text-3xl mr-6 w-8 text-center">{letter}</span>
                <span className="text-2xl font-semibold tracking-wide flex-grow">{option}</span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
