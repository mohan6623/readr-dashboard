import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types/book';
import { bookService } from '@/lib/api';
import Navigation from '@/components/layout/Navigation';
import BookGrid from '@/components/ui/BookGrid';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const fetchedBooks = await bookService.getAllBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch books';
      if (errorMessage.includes('authentication')) {
        // Don't show toast for auth errors, user is likely not logged in
        console.log('Not authenticated, skipping book load');
      } else {
        toast({
          title: "Error loading books",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleView = (book: Book) => {
    navigate(`/books/${book.id}`);
  };

  const handleEdit = (book: Book) => {
    navigate(`/admin/books/${book.id}/edit`);
  };

  const handleDelete = async (book: Book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await bookService.deleteBook(book.id.toString());
        setBooks(prev => prev.filter(b => b.id !== book.id));
        toast({
          title: "Book deleted",
          description: `"${book.title}" has been removed from the library.`,
        });
      } catch (error) {
        toast({
          title: "Error deleting book",
          description: "Failed to delete the book. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome to Your Library
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover amazing books from our curated collection
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search Books
              </Button>
              
              {isAdmin && (
                <Button
                  variant="admin"
                  onClick={() => navigate('/admin/books/new')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Book
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card p-6 rounded-lg book-shadow">
              <h3 className="text-sm font-medium text-muted-foreground">Total Books</h3>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? '...' : books.length}
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg book-shadow">
              <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? '...' : new Set(books.map(book => book.category)).size}
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg book-shadow">
              <h3 className="text-sm font-medium text-muted-foreground">Authors</h3>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? '...' : new Set(books.map(book => book.author)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <BookGrid
          books={books}
          onView={handleView}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          isAdmin={isAdmin}
          loading={loading}
          emptyMessage="No books in the library yet"
        />
      </main>
    </div>
  );
};

export default Dashboard;