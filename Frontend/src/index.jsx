import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 🟦 Повністю прибираємо всі логи в продакшені
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
