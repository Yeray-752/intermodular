import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // importa tu configuración
import '../style/App.css'
import '../style/index.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
