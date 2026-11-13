import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/reset.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div id="app-placeholder" />
  </StrictMode>,
);
