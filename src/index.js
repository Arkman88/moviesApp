import { createRoot } from 'react-dom/client';
import App from './components/app/app';
import GenresProvider from './services/genres-provider';
import React from 'react';

import './styles.css';

const root = document.getElementById('root');

createRoot(root).render(
  <React.StrictMode>
    <GenresProvider>
      <App />
    </GenresProvider>
  </React.StrictMode>
);
