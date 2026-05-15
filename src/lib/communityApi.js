const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getToken() {
  return localStorage.getItem('agriCommunityToken') || null;
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const err = await response.json(); if (err.message) message = err.message; } catch {}
    throw new Error(message);
  }
  return response.json();
}

export async function demoLogin(payload) {
  return request(`${API_BASE}/community/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function register(payload) {
  return request(`${API_BASE}/community/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  return request(`${API_BASE}/community/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getPosts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  return request(`${API_BASE}/community/posts?${query.toString()}`, {
    headers: { ...authHeaders() },
  });
}

export async function createPost(payload) {
  const body = new FormData();
  body.append('title',       payload.title);
  body.append('description', payload.description);
  body.append('tags',        (payload.tags || []).join(','));
  body.append('region',      payload.region);
  if (payload.imageFile) body.append('image', payload.imageFile);
  return request(`${API_BASE}/community/posts`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body,
  });
}

export async function deletePost(postId) {
  return request(`${API_BASE}/community/posts/${postId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
}

export async function votePost(postId, value) {
  return request(`${API_BASE}/community/posts/${postId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ value }),
  });
}

export async function savePost(postId) {
  return request(`${API_BASE}/community/posts/${postId}/save`, {
    method: 'POST',
    headers: { ...authHeaders() },
  });
}

export async function sharePost(postId) {
  return request(`${API_BASE}/community/posts/${postId}/share`, {
    method: 'POST',
  });
}

export async function getComments(postId) {
  return request(`${API_BASE}/community/posts/${postId}/comments`, {
    headers: { ...authHeaders() },
  });
}

export async function addComment(postId, payload) {
  return request(`${API_BASE}/community/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

export async function voteComment(commentId, value) {
  return request(`${API_BASE}/community/comments/${commentId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ value }),
  });
}

export async function deleteComment(postId, commentId) {
  return request(`${API_BASE}/community/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('agriCommunityUser');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSession(token, user) {
  localStorage.setItem('agriCommunityToken', token);
  localStorage.setItem('agriCommunityUser', JSON.stringify(user));
  window.dispatchEvent(new Event('agriUserUpdated'));
}

export function clearSession() {
  localStorage.removeItem('agriCommunityToken');
  localStorage.removeItem('agriCommunityUser');
  window.dispatchEvent(new Event('agriUserUpdated'));
}
