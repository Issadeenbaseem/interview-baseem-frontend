// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Posts from './components/Posts';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    document.body.classList.add(theme);
    return () => document.body.classList.remove(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-teal-600 dark:text-teal-300">
            Latest Posts
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-teal-600 text-white dark:bg-teal-500 hover:bg-teal-700 transition-all duration-300"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default App;
