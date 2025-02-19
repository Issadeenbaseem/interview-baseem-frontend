import React, { useEffect, useState } from "react";
import {
  fetchPosts,
  fetchCommentsByPostId,
  deletePost,
  updatePost,
} from "../api";
import AddPost from "./AddPost";
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { Tooltip } from "react-tooltip";

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
  const [isAddPostVisible, setIsAddPostVisible] = useState<boolean>(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<"id" | "title">("id"); // Default sort by ID

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5); // Number of posts per page

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
      setLoading(false);
    };

    loadPosts();
  }, []);

  // Handle post click to fetch comments
  const handlePostClick = async (id: number) => {
    setSelectedPostId(id);
    const data = await fetchCommentsByPostId(id);
    setComments(data);
  };

  // Handle delete post
  const handleDeletePost = async (id: number) => {
    const success = await deletePost(id);
    if (success) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  // Handle new post
  const handleNewPost = (post: Post) => {
    setPosts([post, ...posts]);
    setIsAddPostVisible(false);
  };

  // Handle edit post
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsAddPostVisible(true);
  };

  // Handle update post
  const handleUpdatePost = async (updatedPost: Post) => {
    const result = await updatePost(updatedPost.id, {
      title: updatedPost.title,
      body: updatedPost.body,
    });

    if (result) {
      setPosts(posts.map((post) => (post.id === updatedPost.id ? result : post)));
      setEditingPost(null);
      setIsAddPostVisible(false);
    }
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title); // Sort by title
      } else {
        return a.id - b.id; // Sort by ID
      }
    });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Open dialog for delete/update confirmation
  const openDialog = (action: "delete" | "update", post: Post) => {
    setDialogAction(action);
    setPostToActUpon(post);
    setIsDialogOpen(true);
  };

  // Confirm action (delete/update)
  const confirmAction = () => {
    if (dialogAction === "delete" && postToActUpon) {
      handleDeletePost(postToActUpon.id);
    } else if (dialogAction === "update" && postToActUpon) {
      handleUpdatePost(postToActUpon);
    }
    setIsDialogOpen(false);
  };

  if (loading)
    return <div className="text-center text-gray-600">Loading posts...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-700">Posts</h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "id" | "title")}
              className="w-full sm:w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
            </select>
            <ChevronUpDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => {
              setEditingPost(null);
              setIsAddPostVisible(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition flex items-center justify-center"
            data-tooltip-id="add-post-tooltip"
            data-tooltip-content="Create New Post"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Post
          </button>
          <Tooltip id="add-post-tooltip" />
        </div>
      </div>

      {isAddPostVisible && (
        <AddPost
          onPostAdded={handleNewPost}
          editingPost={editingPost}
          onUpdatePost={handleUpdatePost}
          onCancel={() => setIsAddPostVisible(false)}
        />
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {currentPosts.map((post) => (
            <li key={post.id} className="px-4 py-5 sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {post.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {post.body}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePostClick(post.id)}
                    className="text-teal-600 hover:text-teal-900"
                    data-tooltip-id="view-tooltip"
                    data-tooltip-content="View Comments"
                  >
                    <EyeIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleEditPost(post)}
                    className="text-yellow-600 hover:text-yellow-900"
                    data-tooltip-id="edit-tooltip"
                    data-tooltip-content="Edit Post"
                  >
                    <PencilIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => openDialog("delete", post)}
                    className="text-red-600 hover:text-red-900"
                    data-tooltip-id="delete-tooltip"
                    data-tooltip-content="Delete Post"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                  <Tooltip id="view-tooltip" />
                  <Tooltip id="edit-tooltip" />
                  <Tooltip id="delete-tooltip" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {/* Previous Button */}
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            data-tooltip-id="prev-tooltip"
            data-tooltip-content="Previous"
          >
            &lt;
          </button>
        )}

        {/* Show only 5 page numbers at a time */}
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) })
          .slice(
            Math.floor((currentPage - 1) / 5) * 5,
            Math.floor((currentPage - 1) / 5) * 5 + 5
          )
          .map((_, index) => {
            const pageNumber = Math.floor((currentPage - 1) / 5) * 5 + index + 1;
            if (pageNumber > Math.ceil(filteredPosts.length / postsPerPage)) return null;

            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === pageNumber
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
                data-tooltip-id={`page-${pageNumber}-tooltip`}
                data-tooltip-content={`Page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            );
          })}

        {/* Next Button */}
        {currentPage + 4 < Math.ceil(filteredPosts.length / postsPerPage) && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            data-tooltip-id="next-tooltip"
            data-tooltip-content="Next"
          >
            &gt;
          </button>
        )}
        <Tooltip id="prev-tooltip" />
        <Tooltip id="next-tooltip" />
      </div>

      {/* Comments Section */}
      {selectedPostId && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-teal-700">
            Comments for Post {selectedPostId}
          </h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                <p className="text-gray-600 text-sm">{comment.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
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