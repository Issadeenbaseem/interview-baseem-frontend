// src/components/AddPost.tsx
import React, { useState } from 'react';
import { createPost } from '../api';

const AddPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    const newPost = await createPost({ title, body });
    setTitle('');
    setBody('');
    alert('Post Created: ' + newPost.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-teal-600">Create a New Post</h2>
      <div>
        <label htmlFor="title" className="block text-lg text-teal-600">Title</label>
        <input
          type="text"
          id="title"
          className="w-full p-3 rounded-lg border border-gray-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-lg text-teal-600">Body</label>
        <textarea
          id="body"
          className="w-full p-3 rounded-lg border border-gray-300"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-all duration-300"
      >
        Create Post
      </button>
    </form>
  );
};

export default AddPost;
