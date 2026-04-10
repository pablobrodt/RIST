import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { Upload, Download, Plus, Trash2, Home } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function EditorScreen() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { translateText } = useTranslation();

  const handleAddField = () => {
    setQuestions([
      ...questions,
      { question: '', correct: '', wrong1: '', wrong2: '', wrong3: '' }
    ]);
  };

  const handleRemoveField = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data;
          if (data.length === 0) {
            alert(translateText('setup.error.csvEmpty'));
            return;
          }
          const firstRow = data[0];
          if (!('question' in firstRow) || !('correct' in firstRow) || !('wrong1' in firstRow)) {
            alert(translateText('setup.error.csvInvalid'));
            return;
          }
          setQuestions(data.map(row => ({
            question: row.question || '',
            correct: row.correct || '',
            wrong1: row.wrong1 || '',
            wrong2: row.wrong2 || '',
            wrong3: row.wrong3 || ''
          })));
        },
        error: () => {
          alert(translateText('setup.error.csvParse'));
        }
      });
    }
  };

  const handleExport = () => {
    // Only export valid rows to prevent corrupting the CSV structure
    const validQuestions = questions.filter(q => q.question.trim() !== '' && q.correct.trim() !== '' && q.wrong1.trim() !== '');
    
    if (validQuestions.length === 0) {
      alert(translateText('editor.error.noValidQ'));
      return;
    }

    const csvContent = Papa.unparse(validQuestions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "questions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[var(--color-setup-bg)] text-[var(--color-setup-textPrimary)] p-6 font-sans transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between bg-[var(--color-setup-card)] p-4 rounded-xl shadow-sm border border-slate-700/50 transition-colors">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-700 rounded-lg text-[var(--color-setup-textPrimary)] transition border border-transparent hover:border-slate-600"
            >
              <Home className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-2xl text-[var(--color-setup-accent)]">{translateText('editor.title')}</h1>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center px-4 py-2 bg-[var(--color-setup-inputBg)] text-[var(--color-setup-textPrimary)] text-sm font-medium rounded-lg hover:brightness-110 border border-[var(--color-setup-inputBorder)] transition"
            >
              <Upload className="w-4 h-4 mr-2" />
              {translateText('editor.importBtn')}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleImport} />
            
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg hover:brightness-110 transition"
              style={{ backgroundColor: 'var(--color-setup-button)' }}
            >
              <Download className="w-4 h-4 mr-2" />
              {translateText('editor.exportBtn')}
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="bg-[var(--color-setup-card)] p-5 rounded-xl shadow-md border border-[var(--color-setup-inputBorder)]/50 relative transition-colors group">
              <div className="absolute top-4 right-4 flex space-x-2">
                <button onClick={() => handleRemoveField(index)} className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition" title={translateText('editor.deleteBtn')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute top-4 left-4 text-xs font-bold px-2 py-1 bg-[var(--color-setup-inputBg)]/50 border border-[var(--color-setup-inputBorder)] rounded-full text-[var(--color-setup-textPrimary)] opacity-70">
                #{index + 1}
              </div>

              <div className="mt-8 space-y-4 pr-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--color-setup-textPrimary)] opacity-80 mb-1">{translateText('editor.questionLabel')}</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                    className="w-full bg-[var(--color-setup-inputBg)] border border-[var(--color-setup-inputBorder)] rounded-lg px-3 py-2 text-[var(--color-setup-inputText)] focus:ring-2 focus:ring-[var(--color-setup-accent)] focus:border-[var(--color-setup-accent)] transition outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--color-setup-textPrimary)] opacity-80 mb-1">{translateText('editor.correctLabel')}</label>
                    <input
                      type="text"
                      value={q.correct}
                      onChange={(e) => handleChange(index, 'correct', e.target.value)}
                      className="w-full bg-[var(--color-setup-inputBg)] border border-[var(--color-setup-inputBorder)] rounded-lg px-3 py-2 text-[var(--color-setup-inputText)] focus:ring-2 focus:ring-[var(--color-setup-accent)] transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--color-setup-textPrimary)] opacity-80 mb-1">{translateText('editor.wrong1Label')}</label>
                    <input
                      type="text"
                      value={q.wrong1}
                      onChange={(e) => handleChange(index, 'wrong1', e.target.value)}
                      className="w-full bg-[var(--color-setup-inputBg)] border border-[var(--color-setup-inputBorder)] rounded-lg px-3 py-2 text-[var(--color-setup-inputText)] focus:ring-2 focus:ring-[var(--color-setup-accent)] transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--color-setup-textPrimary)] opacity-60 mb-1">{translateText('editor.wrong2Label')}</label>
                    <input
                      type="text"
                      value={q.wrong2}
                      onChange={(e) => handleChange(index, 'wrong2', e.target.value)}
                      className="w-full bg-[var(--color-setup-inputBg)] border border-[var(--color-setup-inputBorder)] rounded-lg px-3 py-2 text-[var(--color-setup-inputText)] focus:ring-2 focus:ring-[var(--color-setup-accent)] transition outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[var(--color-setup-textPrimary)] opacity-60 mb-1">{translateText('editor.wrong3Label')}</label>
                    <input
                      type="text"
                      value={q.wrong3}
                      onChange={(e) => handleChange(index, 'wrong3', e.target.value)}
                      className="w-full bg-[var(--color-setup-inputBg)] border border-[var(--color-setup-inputBorder)] rounded-lg px-3 py-2 text-[var(--color-setup-inputText)] focus:ring-2 focus:ring-[var(--color-setup-accent)] transition outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-[var(--color-setup-inputBorder)] rounded-xl opacity-60">
               <p className="text-lg">{translateText('editor.emptyState')}</p>
            </div>
          )}

          <button
            onClick={handleAddField}
            className="w-full py-4 border-2 border-dashed border-[var(--color-setup-accent)] text-[var(--color-setup-accent)] rounded-xl flex items-center justify-center font-bold hover:bg-[var(--color-setup-accent)] hover:text-white transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {translateText('editor.addBtn')}
          </button>
        </div>

      </div>
    </div>
  );
}
