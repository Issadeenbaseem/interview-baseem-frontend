// src/components/Posts.tsx
import React, { useEffect, useState } from 'react';
import { fetchPosts, fetchCommentsByPostId, deletePost } from '../api';

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

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <h1 className="text-4xl font-semibold text-teal-600 mb-4">Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            <h3 className="text-xl font-semibold text-teal-600 mb-4">{post.title}</h3>
            <p className="text-gray-700 text-sm line-clamp-3">{post.body}</p>
            <button
              onClick={() => handlePostClick(post.id)}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg transition-all duration-300 hover:bg-teal-500"
            >
              View Comments
            </button>
            <button
              onClick={() => handleDeletePost(post.id)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg transition-all duration-300 hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {selectedPostId && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-teal-600">Comments for Post {selectedPostId}</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-600">{comment.name}</h4>
                <p className="text-gray-700 text-sm">{comment.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
