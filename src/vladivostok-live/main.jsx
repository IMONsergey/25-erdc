import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {installTypographer} from '../vladivostok-20260922/typograph.js';
import '../vladivostok-20260922/styles.css';
import '../vladivostok-20260922/refinements.css';
import '../pages/promo-atlas.css';
const root=document.getElementById('root');installTypographer(root);createRoot(root).render(<StrictMode><App/></StrictMode>);
