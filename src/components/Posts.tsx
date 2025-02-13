// src/components/Posts.tsx
import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api';

interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };
    
    loadPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-500"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-2 ease-in-out"
        >
          <h3 className="text-xl font-semibold text-teal-600 mb-4">{post.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{post.body}</p>
          <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg transition-all duration-300 hover:bg-teal-500 focus:outline-none">
            Read More
          </button>
        </div>
      ))}
    </div>
  );
};

export default Posts;
