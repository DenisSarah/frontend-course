import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { Before } from './Before.jsx';
import './styles.css';

const mode = import.meta.env.MODE;

createRoot(document.getElementById('root')).render(
  mode === 'baseline' || mode === 'compiler' ? <Before /> : <App localName={mode === 'children'} />,
);
