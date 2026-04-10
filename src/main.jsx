import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { GameProvider } from './hooks/useGameSync.jsx'
import { TranslationProvider } from './hooks/useTranslation.jsx'
import { ThemeProvider } from './hooks/useTheme.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <TranslationProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </TranslationProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
