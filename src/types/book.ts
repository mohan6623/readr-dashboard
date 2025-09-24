export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface BookFormData {
  title: string;
  description: string;
  author: string;
  category: string;
  image: File | string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
}