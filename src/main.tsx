import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import { ProgressProvider } from './state/ProgressContext';
import { initAnalytics } from './analytics';
import './styles/cruci.css'; // tokens + base + identity + layout + buttons
import './styles/cruci-app.css'; // components, mapped to the app's class names

initAnalytics();
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
