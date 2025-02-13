const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fetch comments for a post
export const fetchCommentsByPostId = async (postId: number) => {
  try {
    const res = await fetch(`${API_URL}/${postId}/comments`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Create a new post
export const createPost = async (post: { title: string; body: string }) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Failed to create post");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Delete a post
export const deletePost = async (id: number) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
