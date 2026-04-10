import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { Upload, Play, Users, Globe } from 'lucide-react';
import { useGameSync } from '../hooks/useGameSync';
import { useTranslation } from '../hooks/useTranslation';

export default function SetupScreen() {
  const [hostName, setHostName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { syncGameState } = useGameSync();
  const { currentLanguage, setLanguage, translateText } = useTranslation();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStart = () => {
    if (!hostName || !guestName) {
      setError(translateText('setup.error.namesMissing'));
      return;
    }
    if (!file) {
      setError(translateText('setup.error.csvMissing'));
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        if (data.length === 0) {
          setError(translateText('setup.error.csvEmpty'));
          return;
        }

        // Validate headers roughly
        const firstRow = data[0];
        if (!('question' in firstRow) || !('correct' in firstRow) || !('wrong1' in firstRow)) {
          setError(translateText('setup.error.csvInvalid'));
          return;
        }

        const questions = data.map((row) => ({
          question: row.question,
          correct: row.correct,
          wrong1: row.wrong1,
          wrong2: row.wrong2,
          wrong3: row.wrong3,
          shuffledOptions: shuffleArray([row.correct, row.wrong1, row.wrong2, row.wrong3].filter(Boolean))
        }));

        const initialState = {
          hostName,
          guestName,
          questions,
          currentQuestionIndex: 0,
          selectedOption: null,
          isRevealed: false,
          isFinished: false,
          availableHints: 1,
          eliminatedOptions: [],
          results: []
        };

        syncGameState(initialState);
        navigate('/host');
      },
      error: () => {
        setError(translateText('setup.error.csvParse'));
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 tv-glow p-4">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 mb-2">
            RIST
          </h1>
          <p className="text-slate-400 text-sm">{translateText('setup.title')}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{translateText('setup.hostNameLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="pl-10 block w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                placeholder={translateText('setup.hostNamePlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{translateText('setup.guestNameLabel')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="pl-10 block w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all"
                placeholder={translateText('setup.guestNamePlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{translateText('setup.csvLabel')}</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-lg hover:border-sky-500 transition-colors bg-slate-900/50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-300 justify-center">
                  <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none">
                    <span>{translateText('setup.csvUploadText')}</span>
                    <input type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-slate-500">{translateText('setup.csvHint')}</p>
                {file && <p className="text-sm text-emerald-400 mt-2 font-medium">{file.name}</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{translateText('setup.language')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-500" />
              </div>
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="pl-10 block w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
          </div>

          {error && <div className="text-rose-400 text-sm text-center bg-rose-900/20 py-2 rounded-lg">{error}</div>}

          <button
            onClick={handleStart}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-all transform hover:scale-[1.02]"
          >
            <Play className="h-5 w-5 mr-2" />
            {translateText('setup.startButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
