import { Book, BookFormData, SearchFilters } from '@/types/book';
import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class BookService {
  private processBookImage = (book: any): Book => {
    // Convert byte array to base64 string for display if image exists
    if (book.image && Array.isArray(book.image)) {
      const base64String = btoa(String.fromCharCode(...book.image));
      book.image = `data:${book.imageType || 'image/jpeg'};base64,${base64String}`;
    } else if (!book.image) {
      book.image = '/placeholder.svg'; // Default placeholder
    }
    return book;
  };

  async getAllBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers: {
        ...authService.getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const books = await response.json();
    return books.map(this.processBookImage);
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

      const books = await response.json();
      return books.map(this.processBookImage);
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

    const book = await response.json();
    return this.processBookImage(book);
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    const formData = new FormData();
    
    // Create book object matching BookDto structure
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
      const error = await response.text();
      throw new Error(error || 'Failed to create book');
    }

    // Backend returns success message, fetch all books to get the new one
    const books = await this.getAllBooks();
    return books[books.length - 1];
  }

  async updateBook(id: string, bookData: BookFormData): Promise<Book> {
    const formData = new FormData();
    
    // Create book object matching BookDto structure
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
      const error = await response.text();
      throw new Error(error || 'Failed to update book');
    }

    // Fetch the updated book
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
      const error = await response.text();
      throw new Error(error || 'Failed to delete book');
    }
  }
}

export const bookService = new BookService();