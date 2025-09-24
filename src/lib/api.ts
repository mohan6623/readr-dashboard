import { Book, BookFormData, SearchFilters } from '@/types/book';
import { authService } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class BookService {
  async getAllBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return response.json();
  }

  async searchBooks(filters: SearchFilters): Promise<Book[]> {
    const params = new URLSearchParams();
    if (filters.query) params.append('q', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);

    const response = await fetch(`${API_BASE_URL}/books/search?${params}`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    return response.json();
  }

  async getBookById(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }

    return response.json();
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('description', bookData.description);
    formData.append('author', bookData.author);
    formData.append('category', bookData.category);
    
    if (bookData.image instanceof File) {
      formData.append('image', bookData.image);
    }

    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create book');
    }

    return response.json();
  }

  async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    const formData = new FormData();
    formData.append('title', bookData.title);
    formData.append('description', bookData.description);
    formData.append('author', bookData.author);
    formData.append('category', bookData.category);
    
    if (bookData.image instanceof File) {
      formData.append('image', bookData.image);
    }

    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update book');
    }

    return response.json();
  }

  async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  }
}

export const bookService = new BookService();