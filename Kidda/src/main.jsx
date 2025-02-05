import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  
import './index.css';  

// Crear un enlace para cargar la fuente desde Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Caveat+Brush&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);