// src/api.ts
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts`);
  return await response.json();
};

export const fetchPostById = async (id: number) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  return await response.json();
};

export const fetchCommentsByPostId = async (postId: number) => {
  const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
  return await response.json();
};

export const createPost = async (post: { title: string; body: string }) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};

export const updatePost = async (id: number, post: { title: string; body: string }) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};

export const deletePost = async (id: number) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
};
