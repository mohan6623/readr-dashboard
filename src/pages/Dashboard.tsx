import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types/book';
import { bookService } from '@/lib/api';
import Navigation from '@/components/layout/Navigation';
import BookGrid from '@/components/ui/BookGrid';
import CategoryTabs from '@/components/ui/CategoryTabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Grid3X3, List, BookOpen } from 'lucide-react';
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

  // Filter logic
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

  // Mock stats - in real app these would come from user reading data
  const stats = {
    total: books.length,
    currentlyReading: 3, // Mock data
    completed: 3 // Mock data
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Library</h1>
              <p className="text-muted-foreground">Your personal book collection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-right">
            <div>
              <div className="text-2xl font-bold text-foreground">{loading ? '...' : stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{stats.currentlyReading}</div>
              <div className="text-sm text-muted-foreground">Currently Reading</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Welcome back!
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover your next great read from your curated collection
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-sm w-96"
              />
            </div>
            <div className="flex items-center gap-2 bg-card rounded-lg p-1 book-shadow">
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
            {isAdmin && (
              <Button
                variant="admin"
                onClick={() => navigate('/admin/books/new')}
                className="flex items-center gap-2 h-12"
              >
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        {!loading && books.length > 0 && (
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}

        {/* Results Count */}
        <div className="mb-6">
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