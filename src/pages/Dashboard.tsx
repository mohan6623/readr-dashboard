import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types/book';
import { bookService } from '@/lib/api';
import { reviewsService } from '@/lib/reviews';
import Navigation from '@/components/layout/Navigation';
import BookGrid from '@/components/ui/BookGrid';
import CategoryTabs from '@/components/ui/CategoryTabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      
      // Load rating stats for each book
      const booksWithRatings = await Promise.all(
        fetchedBooks.map(async (book) => {
          try {
            const stats = await reviewsService.getBookRatingStats(book.id);
            return {
              ...book,
              avgRating: stats.avgRating,
              totalReviews: stats.totalReviews,
              ratingBreakdown: stats.breakdown,
            };
          } catch (error) {
            // If rating fetch fails, just return book without ratings
            return book;
          }
        })
      );
      
      setBooks(booksWithRatings);
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
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Category filter
      if (selectedCategory !== 'All' && book.category !== selectedCategory) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return book.title.toLowerCase().includes(query) || 
               book.author.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [books, selectedCategory, searchQuery]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(books.map(book => book.category))).sort();
    return ['All', ...uniqueCategories];
  }, [books]);

  // Stats: total books, unique categories, unique authors
  const stats = useMemo(() => {
    const categoryCount = new Set(books.map((b) => b.category).filter(Boolean)).size;
    const authorCount = new Set(books.map((b) => b.author).filter(Boolean)).size;
    return {
      total: books.length,
      categories: categoryCount,
      authors: authorCount,
    };
  }, [books]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section with Stats on the right */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Welcome back!</h2>
              </div>
              <p className="text-muted-foreground">
                Discover your next great read from your curated collection
              </p>
            </div>
            {/* Stats moved here to the right */}
            <div className="flex items-center gap-6 text-right">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{loading ? '...' : stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.categories}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.authors}</div>
                <div className="text-xs text-muted-foreground">Authors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter row: Category Tabs (left) + View mode toggle (right) */}
        {!loading && books.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between gap-4 whitespace-nowrap">
              <div className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap pr-2">
                <CategoryTabs
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              <div className="flex items-center gap-2 bg-card rounded-lg p-1 book-shadow flex-shrink-0">
                <Button 
                  variant={viewMode === 'grid' ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? "default" : "ghost"} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-2">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${filteredBooks.length} books found`}
          </p>
        </div>

        {/* Books Display */}
        <BookGrid
          books={filteredBooks}
          onView={handleView}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          isAdmin={isAdmin}
          loading={loading}
          emptyMessage="No books match the current filters"
          viewMode={viewMode}
        />
      </main>
    </div>
  );
};

export default Dashboard;