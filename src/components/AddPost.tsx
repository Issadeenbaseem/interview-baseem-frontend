import React, { useState, useEffect } from "react";
import { createPost } from "../api.ts";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface AddPostProps {
  onPostAdded: (post: Post) => void;
  editingPost?: Post | null;
  onUpdatePost?: (post: Post) => void;
}

const AddPost: React.FC<AddPostProps> = ({ onPostAdded, editingPost, onUpdatePost }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setBody(editingPost.body);
    } else {
      setTitle("");
      setBody("");
    }
  }, [editingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPost && onUpdatePost) {
      onUpdatePost({ ...editingPost, title, body });
    } else {
      const newPost = await createPost({ title, body });
      if (newPost) {
        onPostAdded(newPost);
      }
    }

    setTitle("");
    setBody("");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-teal-700 mb-4">{editingPost ? "Edit Post" : "Add a New Post"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <button
          type="submit"
          className="w-full py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-400 transition"
        >
          {editingPost ? "Update Post" : "Add Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
