import { UsersResponse, PostsResponse, CommentsResponse } from '../types';
const API_BASE_URL = '/test';


// const API_BASE_URL = 'http://20.244.56.144/test';
const ACCESS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTM3NzM0LCJpYXQiOjE3NDI1Mzc0MzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjJjNjVjYzU4LWQ3ODgtNDcwZC1iNmUwLTJmZTdlOGU0ODQ3NyIsInN1YiI6IjIyMDUwMTM5MzY4QHJldmEuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiUmV2YTE2OSIsImNsaWVudElEIjoiMmM2NWNjNTgtZDc4OC00NzBkLWI2ZTAtMmZlN2U4ZTQ4NDc3IiwiY2xpZW50U2VjcmV0IjoiemluYnRJTFZmVXBFU2J2cCIsIm93bmVyTmFtZSI6IlJpam8gU2ltb24gVE0iLCJvd25lckVtYWlsIjoiMjIwNTAxMzkzNjhAcmV2YS5lZHUuaW4iLCJyb2xsTm8iOiJSMjJFRjE2OSJ9.E61L6b6Vazf5yPfLWBUlGDLsIuJ5UJdeHc4oZLrypYc";

export const fetchUsers = async (): Promise<UsersResponse> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: ACCESS_TOKEN, 
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Fetch Users Error:", response.status, errorText);
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  return response.json();
};

export const fetchUserPosts = async (userId: string): Promise<PostsResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
    headers: {
      Authorization: ACCESS_TOKEN, 
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user posts');
  return response.json();
};

export const fetchPostComments = async (postId: number): Promise<CommentsResponse> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    headers: {
      Authorization: ACCESS_TOKEN, 
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch post comments');
  return response.json();
};
