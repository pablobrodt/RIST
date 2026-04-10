import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSync } from '../hooks/useGameSync';
import { Trophy, Check, X, Home } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function ResultScreen() {
  const { gameState, resetGame } = useGameSync();
  const navigate = useNavigate();
  const location = useLocation();
  const isHost = location.state?.isHost;
  const { translateText } = useTranslation();

  useEffect(() => {
    if (!gameState) {
      navigate(isHost ? '/' : '/guest');
    }
  }, [gameState, navigate]);

  if (!gameState) return null;

  const correctCount = gameState.results.filter(r => r.result).length;
  const totalCount = gameState.results.length;

  const handleHome = () => {
    resetGame();
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[var(--color-result-bg)] flex flex-col items-center py-8 px-4 tv-glow font-sans text-[var(--color-result-textPrimary)] transition-colors">
      <div className="max-w-4xl w-full h-full flex flex-col justify-between">
        
        <div className="text-center mb-6 shrink-0 animate-fade-in-up">
          <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-result-accent)', filter: 'drop-shadow(0 0 15px var(--color-result-accent))' }} />
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: 'var(--color-result-accent)' }}>
            {translateText('result.title')}
          </h1>
          <p className="text-xl opacity-80">
            {translateText('result.score')} 
            <span className="font-bold mx-2" style={{ color: 'var(--color-result-accent)' }}>{correctCount}</span> {translateText('result.of')} {totalCount}
          </p>
        </div>

        <div className="bg-[var(--color-result-tableRow)]/50 backdrop-blur rounded-2xl border border-slate-700 shadow-2xl flex-1 overflow-y-auto min-h-0 mb-6 transition-colors">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 backdrop-blur shadow-sm">
              <tr className="bg-[var(--color-result-tableHeader)] text-sm uppercase tracking-wider transition-colors" style={{ color: 'var(--color-setup-accent)' }}>
                <th className="py-4 px-6 font-semibold w-16">{translateText('result.colNumber')}</th>
                <th className="py-4 px-6 font-semibold border-l border-slate-700/50">{translateText('result.colQuestion')}</th>
                <th className="py-4 px-6 font-semibold border-l border-slate-700/50 w-32 text-center">{translateText('result.colResult')}</th>
                <th className="py-4 px-6 font-semibold border-l border-slate-700/50 w-1/4">{translateText('result.colCorrectAnswer')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {gameState.results.map((item, idx) => (
                <tr key={idx} className="hover:brightness-110 transition-colors bg-[var(--color-result-tableRow)]">
                  <td className="py-4 px-6 opacity-70 font-medium">{idx + 1}</td>
                  <td className="py-4 px-6 border-l border-slate-800/50 font-medium">{item.question}</td>
                  <td className="py-4 px-6 border-l border-slate-800/50 text-center">
                    {item.result ? (
                      <div className="flex justify-center rounded-full py-1" style={{ backgroundColor: 'var(--color-result-correctRow)', opacity: 0.8 }}>
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="flex justify-center rounded-full py-1" style={{ backgroundColor: 'var(--color-result-wrongRow)', opacity: 0.8 }}>
                        <X className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 border-l border-slate-800/50 font-medium" style={{ color: 'var(--color-result-correctRow)' }}>
                    {item.correctAnswer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center flex-col items-center space-y-4 shrink-0">
          {isHost && (
            <button
              onClick={handleHome}
              style={{ backgroundColor: 'var(--color-result-homeBtn)' }}
              className="flex items-center px-6 py-3 text-white font-bold rounded-xl transition hover:brightness-110 shadow-lg transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              {translateText('result.newGame')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
