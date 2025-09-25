export interface Book {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  imageName?: string;
  imageType?: string;
  image: string; // Base64 or URL for display
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  role?: string;
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