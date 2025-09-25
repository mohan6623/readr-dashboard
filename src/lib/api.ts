import { Book, BookFormData, SearchFilters } from '@/types/book';
import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
    // Use title search endpoint from backend
    if (filters.query) {
      const response = await fetch(`${API_BASE_URL}/title/${encodeURIComponent(filters.query)}`, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search books');
      }

      return response.json();
    }

    // If no query, return all books
    return this.getAllBooks();
  }

  async getBookById(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/book/${id}`, {
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
    
    // Create book object for the backend
    const bookJson = {
      title: bookData.title,
      description: bookData.description,
      author: bookData.author,
      category: bookData.category
    };
    
    formData.append('book', new Blob([JSON.stringify(bookJson)], {
      type: 'application/json'
    }));
    
    if (bookData.image instanceof File) {
      formData.append('imageFile', bookData.image);
    }

    const response = await fetch(`${API_BASE_URL}/addbook`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create book');
    }

    // Backend returns string, so we need to fetch the created book
    const books = await this.getAllBooks();
    return books[books.length - 1]; // Return the last added book
  }

  async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    const formData = new FormData();
    
    // Create book object for the backend
    const bookJson = {
      title: bookData.title,
      description: bookData.description,
      author: bookData.author,
      category: bookData.category
    };
    
    formData.append('book', new Blob([JSON.stringify(bookJson)], {
      type: 'application/json'
    }));
    
    if (bookData.image instanceof File) {
      formData.append('imageFile', bookData.image);
    }

    const response = await fetch(`${API_BASE_URL}/book/${id}`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update book');
    }

    // Backend returns string, so fetch the updated book
    return this.getBookById(id);
  }

  async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/book/${id}`, {
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