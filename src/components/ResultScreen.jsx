import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSync } from '../hooks/useGameSync';
import { Trophy, Check, X, Home } from 'lucide-react';

export default function ResultScreen() {
  const { gameState, resetGame } = useGameSync();
  const navigate = useNavigate();
  const location = useLocation();
  const isHost = location.state?.isHost;

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
    // UseEffect will catch the null gameState and push us back
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-950 flex flex-col items-center py-8 px-4 tv-glow font-sans text-white">
      <div className="max-w-4xl w-full h-full flex flex-col justify-between">
        
        <div className="text-center mb-6 shrink-0 animate-fade-in-up">
          <Trophy className="w-16 h-16 mx-auto text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">
            Resultados Finais
          </h1>
          <p className="text-xl text-slate-300">
            Pontuação Total: 
            <span className="text-amber-400 font-bold mx-2">{correctCount}</span> de {totalCount}
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-700 shadow-2xl flex-1 overflow-y-auto min-h-0 mb-6">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 backdrop-blur shadow-sm">
              <tr className="bg-slate-800/80 text-sky-400 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold w-16">#</th>
                <th className="py-4 px-6 font-semibold border-l border-slate-700">Pergunta</th>
                <th className="py-4 px-6 font-semibold border-l border-slate-700 w-32 text-center">Resultado</th>
                <th className="py-4 px-6 font-semibold border-l border-slate-700 w-1/4">Resposta Correta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {gameState.results.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-4 px-6 border-l border-slate-800/50 font-medium">{item.question}</td>
                  <td className="py-4 px-6 border-l border-slate-800/50 text-center">
                    {item.result ? (
                      <div className="flex justify-center bg-emerald-500/20 rounded-full py-1">
                        <Check className="w-5 h-5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="flex justify-center bg-rose-500/20 rounded-full py-1">
                        <X className="w-5 h-5 text-rose-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 border-l border-slate-800/50 text-emerald-400 font-medium">
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
              className="flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(2,132,199,0.5)] transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Iniciar Novo Jogo
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
