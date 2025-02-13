import React, { useState } from "react";
import { createPost } from "../api";

const AddPost: React.FC<{ onPostAdded: (post: any) => void }> = ({ onPostAdded }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    const newPost = await createPost({ title, body });
    setLoading(false);

    onPostAdded(newPost);
    setTitle("");
    setBody("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white shadow-md rounded-lg p-6 mb-6 transition-all duration-500"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New Post</h2>

      <div className="relative mb-4">
        <input 
          type="text" 
          id="title" 
          className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none peer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="title" className="absolute left-4 top-3 text-gray-500 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-teal-500 transition-all">
         
        </label>
      </div>

      <div className="relative mb-4">
        <textarea 
          id="body"
          className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none peer"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <label htmlFor="body" className="absolute left-4 top-3 text-gray-500 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-teal-500 transition-all">
          Body
        </label>
      </div>

      <button 
        type="submit"
        className={`w-full py-3 rounded-md text-white font-semibold transition-all duration-300 
          ${!title || !body ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-500"}`}
        disabled={!title || !body || loading}
      >
        {loading ? "Adding..." : "Create Post"}
      </button>
    </form>
  );
};

export default AddPost;
