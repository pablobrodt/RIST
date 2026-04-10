import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { Download, Upload, RotateCcw, Home } from 'lucide-react';

export default function ThemeScreen() {
  const navigate = useNavigate();
  const { theme, updateTheme, defaultTheme } = useTheme();
  const { translateText } = useTranslation();
  const fileInputRef = useRef(null);

  const handleColorChange = (section, key, val) => {
    updateTheme({
      ...theme,
      [section]: {
        ...theme[section],
        [key]: val
      }
    });
  };

  const handleReset = () => {
    if (window.confirm(translateText('theme.confirmReset'))) {
      updateTheme(defaultTheme);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(theme, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "theme_config.json");
    dlAnchorElem.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          // Very basic validation could go here
          updateTheme(parsed);
          alert(translateText('theme.alertImportSuccess'));
        } catch (err) {
          alert(translateText('theme.alertImportError'));
        }
      };
      reader.readAsText(file);
    }
  };

  const renderSection = (sectionName, title) => {
    const sectionObj = theme[sectionName];
    if (!sectionObj) return null;

    return (
      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700 shadow-xl">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500 mb-4 uppercase tracking-wider">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sectionObj).map(([key, val]) => {
            const translatedLabel = translateText(`theme.keys.${key}`);
            const displayLabel = translatedLabel !== `theme.keys.${key}` ? translatedLabel : key;
            return (
              <div key={key} className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {displayLabel}
                </label>
                <div className="flex items-center space-x-3 bg-slate-900 rounded-lg p-2 border border-slate-700">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) => handleColorChange(sectionName, key, e.target.value)}
                    className="w-10 h-10 border-0 rounded cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <span className="text-sm font-mono text-slate-300 uppercase">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-100 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
               {translateText('theme.title')}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{translateText('theme.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center transition border border-slate-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {translateText('theme.import')}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center transition"
            >
              <Download className="w-4 h-4 mr-2" />
              {translateText('theme.export')}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 rounded-lg flex items-center transition border border-rose-500/30"
              title={translateText('theme.reset')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg flex items-center transition"
            >
              <Home className="w-4 h-4 mr-2" />
              {translateText('theme.done')}
            </button>
          </div>
        </div>

        {renderSection('setup', translateText('theme.sections.setup'))}
        {renderSection('host', translateText('theme.sections.host'))}
        {renderSection('guest', translateText('theme.sections.guest'))}
        {renderSection('result', translateText('theme.sections.result'))}

      </div>
    </div>
  );
}
