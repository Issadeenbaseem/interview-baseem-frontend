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
  onCancel?: () => void; // New prop for closing the form
}

const AddPost: React.FC<AddPostProps> = ({
  onPostAdded,
  editingPost,
  onUpdatePost,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setBody(editingPost.body);
    } else {
      setTitle("");
      setBody("");
    }
  }, [editingPost]);

  const validate = () => {
    const newErrors: { title?: string; body?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!body.trim()) newErrors.body = "Body is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
    setErrors({});
  };

  const handleClear = () => {
    setTitle("");
    setBody("");
    setErrors({});
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel(); // Call the onCancel function to close the form
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-teal-700 mb-4">
        {editingPost ? "Edit Post" : "Add a New Post"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby="title-error"
          />
          {errors.title && (
            <p id="title-error" className="mt-2 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Body
          </label>
          <textarea
            id="body"
            placeholder="Enter the content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              errors.body ? "border-red-500" : "border-gray-300"
            }`}
            aria-invalid={errors.body ? "true" : "false"}
            aria-describedby="body-error"
          />
          {errors.body && (
            <p id="body-error" className="mt-2 text-sm text-red-600">
              {errors.body}
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-400 transition"
          >
            {editingPost ? "Update Post" : "Add Post"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-400 transition"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;