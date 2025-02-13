import React, { useEffect, useState } from "react";
import { fetchPosts, fetchCommentsByPostId, deletePost, updatePost } from "../api";
import AddPost from "./AddPost";
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogAction, setDialogAction] = useState<"delete" | "update" | null>(null);
  const [postToActUpon, setPostToActUpon] = useState<Post | null>(null);

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
    setPosts([post, ...posts]);
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

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDialog = (action: "delete" | "update", post: Post) => {
    setDialogAction(action);
    setPostToActUpon(post);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (dialogAction === "delete" && postToActUpon) {
      handleDeletePost(postToActUpon.id);
    } else if (dialogAction === "update" && postToActUpon) {
      handleUpdatePost(postToActUpon);
    }
    setIsDialogOpen(false);
  };

  if (loading) return <div className="text-center text-gray-600">Loading posts...</div>;


  return (
    <div className="max-w-4xl mx-auto">
      <AddPost onPostAdded={handleNewPost} editingPost={editingPost} onUpdatePost={handleUpdatePost} />
  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-700">Posts</h1>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
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
                <EyeIcon className="h-5 w-5 mr-1" />
                View
              </button>
  
              <button
                onClick={() => handleEditPost(post)}
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-400 transition flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-1" />
                Edit
              </button>
  
              <button
                onClick={() => openDialog("delete", post)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-400 transition flex items-center"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                Delete
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
  
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <Dialog.Title className="text-lg font-bold">
              {dialogAction === "delete" ? "Confirm Delete" : "Confirm Update"}
            </Dialog.Title>
            <Dialog.Description className="mt-2">
              {dialogAction === "delete"
                ? "Are you sure you want to delete this post? This action cannot be undone."
                : "Are you sure you want to update this post?"}
            </Dialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
  
};

export default Posts;
