// src/App.tsx
import React from "react";
import Posts from "./components/Posts.tsx";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl">
        <Posts />
      </div>
    </div>
  );
};

export default App;
