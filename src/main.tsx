import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { ProgressProvider } from './state/ProgressContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter keeps deep links working on GitHub Pages without server config. */}
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
);
