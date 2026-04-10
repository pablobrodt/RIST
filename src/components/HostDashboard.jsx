import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSync } from '../hooks/useGameSync';
import { Lightbulb, CheckCircle2, ChevronRight, Home, ExternalLink } from 'lucide-react';

export default function HostDashboard() {
  const { gameState, updateGameState, resetGame } = useGameSync();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameState) {
      navigate('/');
    } else if (gameState.isFinished) {
      navigate('/result', { state: { isHost: true } });
    }
  }, [gameState, navigate]);

  if (!gameState) return null;

  const currentQ = gameState.questions[gameState.currentQuestionIndex];

  const handleSelectOption = (option) => {
    if (gameState.isRevealed) return;
    updateGameState({ selectedOption: option === gameState.selectedOption ? null : option });
  };

  const handleConfirm = () => {
    if (!gameState.selectedOption) return;
    
    // Save result
    const isCorrect = gameState.selectedOption === currentQ.correct;
    const newResults = [...gameState.results, {
      question: currentQ.question,
      result: isCorrect,
      correctAnswer: currentQ.correct
    }];

    updateGameState({ 
      isRevealed: true,
      results: newResults
    });
  };

  const handleNext = () => {
    if (gameState.currentQuestionIndex < gameState.questions.length - 1) {
      updateGameState({
        currentQuestionIndex: gameState.currentQuestionIndex + 1,
        selectedOption: null,
        isRevealed: false,
        eliminatedOptions: []
      });
    } else {
      updateGameState({ isFinished: true });
    }
  };

  const handleHint = () => {
    if (gameState.availableHints > 0 && !gameState.isRevealed) {
      const wrongs = [currentQ.wrong1, currentQ.wrong2, currentQ.wrong3];
      // Randomly pick 2 wrongs
      const shuffledWrongs = wrongs.sort(() => 0.5 - Math.random());
      const toEliminate = shuffledWrongs.slice(0, 2);
      
      updateGameState({
        eliminatedOptions: toEliminate,
        availableHints: gameState.availableHints - 1
      });
    }
  };

  const handleHome = () => {
    if (window.confirm('Tem certeza de que deseja encerrar o jogo atual e voltar à configuração?')) {
      resetGame();
      navigate('/');
    }
  };

  const openGuestTab = () => {
    window.open('/guest', '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleHome}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Voltar ao Início"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-xl text-slate-800">Painel do Apresentador</h1>
              <p className="text-sm text-slate-500">Apresentador: {gameState.hostName} | Convidado: {gameState.guestName}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
             <button
              onClick={openGuestTab}
              className="flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Visão do Convidado
            </button>
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100">
              Pergunta {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          
          {/* Main Stage */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[160px] flex items-center justify-center">
              <h2 className="text-2xl font-bold text-center text-slate-800">
                {currentQ.question}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {currentQ.shuffledOptions.map((option, idx) => {
                const isSelected = gameState.selectedOption === option;
                const isCorrect = option === currentQ.correct;
                const isEliminated = gameState.eliminatedOptions.includes(option);
                
                let btnClass = "p-4 text-left rounded-xl border-2 transition-all relative overflow-hidden ";
                
                if (isEliminated) {
                   btnClass += "border-slate-200 bg-slate-50 opacity-40 cursor-not-allowed";
                } else if (isSelected) {
                   btnClass += "border-amber-400 bg-amber-50 shadow-[0_0_0_4px_rgba(251,191,36,0.1)]";
                } else {
                   btnClass += "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer";
                }

                // Explicit host highlight indicator for the correct option
                const showHostHighlight = isCorrect;

                return (
                  <button 
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isEliminated || gameState.isRevealed}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg text-slate-700">{['A', 'B', 'C', 'D'][idx]}: {option}</span>
                      {showHostHighlight && (
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                          CORRETO
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2">Controles do Jogo</h3>
              
              <button
                onClick={handleConfirm}
                disabled={!gameState.selectedOption || gameState.isRevealed}
                className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirmar Resposta
              </button>

              <button
                onClick={handleNext}
                disabled={!gameState.isRevealed}
                className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {gameState.currentQuestionIndex < gameState.questions.length - 1 ? 'Próxima Pergunta' : 'Mostrar Resultados'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-slate-800">Poderes</h3>
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                  Disponível: {gameState.availableHints}
                </span>
              </div>
              
              <button
                onClick={handleHint}
                disabled={gameState.availableHints === 0 || gameState.isRevealed}
                className="w-full flex items-center justify-center py-3 px-4 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Dica 50:50
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
