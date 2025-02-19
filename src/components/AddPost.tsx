import React, { useState, useEffect } from "react";
import { createPost } from "../api.ts";
import { PlusIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface AddPostProps {
  onPostAdded: (post: Post) => void;
  editingPost?: Post | null;
  onUpdatePost?: (post: Post) => void;
  onCancel?: () => void;
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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 relative">
      {/* Close Button (Top-Right Corner) */}
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition"
        data-tooltip-id="close-tooltip"
        data-tooltip-content="Close Form"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <Tooltip id="close-tooltip" />

      <h2 className="text-2xl font-semibold text-teal-700 mb-6">
        {editingPost ? "Edit Post" : "Add a New Post"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
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
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Body
          </label>
          <textarea
            id="body"
            placeholder="Enter the content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
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
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="w-full sm:w-auto py-2 px-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition flex items-center justify-center"
            data-tooltip-id="submit-tooltip"
            data-tooltip-content={editingPost ? "Update Post" : "Add Post"}
          >
            {editingPost ? (
              <ArrowPathIcon className="h-5 w-5 mr-2" />
            ) : (
              <PlusIcon className="h-5 w-5 mr-2" />
            )}
            {editingPost ? "Update" : "Add"}
          </button>
          <Tooltip id="submit-tooltip" />

          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition flex items-center justify-center"
            data-tooltip-id="clear-tooltip"
            data-tooltip-content="Clear Form"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
          <Tooltip id="clear-tooltip" />
        </div>
      </form>
    </div>
  );
};

export default AddPost;