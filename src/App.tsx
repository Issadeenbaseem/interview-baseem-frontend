// src/App.tsx
import React from 'react';
import Posts from './components/Posts';
import AddPost from './components/AddPost';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-teal-600 mb-6">Post Management</h1>
        <AddPost />
        <Posts />
      </div>
    </div>
  );
};

export default App;
