import { createRoot } from 'react-dom/client';
import App from './components/app/app';
import GenresProvider from './services/genres-provider';

import './styles.css';

const root = document.getElementById('root');

createRoot(root).render(
  <GenresProvider>
    <App />
  </GenresProvider>
);
