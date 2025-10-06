import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Book, SearchFilters } from '@/types/book';
import { bookService } from '@/lib/api';
import { reviewsService } from '@/lib/reviews';
import Navigation from '@/components/layout/Navigation';
import SearchBar from '@/components/search/SearchBar';
import BookGrid from '@/components/ui/BookGrid';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize filters from URL params
  const initialFilters: SearchFilters = {
    query: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    author: searchParams.get('author') || undefined,
  };

  useEffect(() => {
    // If there are URL params, perform search on mount
    if (initialFilters.query || initialFilters.category || initialFilters.author) {
      handleSearch(initialFilters);
    }
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setHasSearched(true);
      
      // Update URL params
      const params = new URLSearchParams();
      if (filters.query) params.set('q', filters.query);
      if (filters.category) params.set('category', filters.category);
      if (filters.author) params.set('author', filters.author);
      setSearchParams(params);

      // Perform search
      const results = await bookService.searchBooks(filters);
      
      // Load rating stats for each book
      const booksWithRatings = await Promise.all(
        results.map(async (book) => {
          try {
            const stats = await reviewsService.getBookRatingStats(book.id);
            return {
              ...book,
              avgRating: stats.avgRating,
              totalReviews: stats.totalReviews,
              ratingBreakdown: stats.breakdown,
            };
          } catch (error) {
            return book;
          }
        })
      );
      
      setBooks(booksWithRatings);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search books. Please try again.",
        variant: "destructive",
      });
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

  const getResultsText = () => {
    if (!hasSearched) return null;
    
    const count = books.length;
    const filters = [];
    if (initialFilters.query) filters.push(`"${initialFilters.query}"`);
    if (initialFilters.category) filters.push(`category: ${initialFilters.category}`);
    if (initialFilters.author) filters.push(`author: ${initialFilters.author}`);
    
    const filterText = filters.length > 0 ? ` for ${filters.join(', ')}` : '';
    
    return `Found ${count} book${count !== 1 ? 's' : ''}${filterText}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Search Books
          </h1>
          <p className="text-muted-foreground text-lg">
            Find your next great read from our collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            initialFilters={initialFilters}
          />
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {getResultsText()}
            </p>
          </div>
        )}

        {/* Books Grid */}
        {hasSearched ? (
          <BookGrid
            books={books}
            onView={handleView}
            onEdit={isAdmin ? handleEdit : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
            isAdmin={isAdmin}
            loading={loading}
            emptyMessage="No books match your search criteria"
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start your search
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Use the search bar above to find books by title, author, category, or description.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;