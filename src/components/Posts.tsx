import React, { useEffect, useState } from "react";
import { fetchPosts, fetchCommentsByPostId, deletePost, updatePost } from "../api.ts";
import AddPost from "./AddPost.tsx";
import { PencilIcon, TrashIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const handlePostClick = async (id: number) => {
    setSelectedPostId(id);
    const data = await fetchCommentsByPostId(id);
    setComments(data);
  };

  const handleDeletePost = async (id: number) => {
    const success = await deletePost(id);
    if (success) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleNewPost = (post: Post) => {
    setPosts([post, ...posts]); // Add new post at the top
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    const result = await updatePost(updatedPost.id, {
      title: updatedPost.title,
      body: updatedPost.body,
    });

    if (result) {
      setPosts(posts.map((post) => (post.id === updatedPost.id ? result : post)));
      setEditingPost(null);
    }
  };

  if (loading) return <div className="text-center text-gray-600">Loading posts...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* AddPost will handle both adding and editing */}
      <AddPost onPostAdded={handleNewPost} editingPost={editingPost} onUpdatePost={handleUpdatePost} />

      <h1 className="text-3xl font-bold text-teal-700 mb-6">Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.body}</p>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handlePostClick(post.id)}
                className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-400 transition flex items-center"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" /> {/* Chat icon */}
               
              </button>

              <button
                onClick={() => handleEditPost(post)}
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" /> {/* Edit icon */}
              </button>

              <button
                onClick={() => handleDeletePost(post.id)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-400 transition flex items-center"
              >
                <TrashIcon className="h-5 w-5 mr-2" /> {/* Trash icon */}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPostId && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-teal-700">Comments for Post {selectedPostId}</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                <p className="text-gray-600 text-sm">{comment.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
