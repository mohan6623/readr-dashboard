import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/types/book';
import { bookService } from '@/lib/api';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash2, User, Calendar, Loader2 } from 'lucide-react';

const BookDetails = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const fetchedBook = await bookService.getBookById(id);
      setBook(fetchedBook);
    } catch (error) {
      toast({
        title: "Error loading book",
        description: "Failed to load book details. Please try again.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;
    
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await bookService.deleteBook(book.id.toString());
        toast({
          title: "Book deleted",
          description: `"${book.title}" has been removed from the library.`,
        });
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: "Error deleting book",
          description: "Failed to delete the book. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading book details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Book not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The book you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <Card className="book-shadow-elevated overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[3/4] w-full">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-2 leading-tight">
                    {book.title}
                  </h1>
                  <div className="flex items-center text-xl text-muted-foreground mb-4">
                    <User className="h-5 w-5 mr-2" />
                    <span>by {book.author}</span>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/books/${book.id.toString()}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {book.category}
                </Badge>
                {book.createdAt && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Added {new Date(book.createdAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>

            <Card className="book-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap">
                    {book.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="book-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Book Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Author</h3>
                    <p className="text-muted-foreground">{book.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Category</h3>
                    <p className="text-muted-foreground capitalize">{book.category}</p>
                  </div>
                  {book.createdAt && (
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Date Added</h3>
                      <p className="text-muted-foreground">
                        {new Date(book.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {book.updatedAt && book.updatedAt !== book.createdAt && (
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Last Updated</h3>
                      <p className="text-muted-foreground">
                        {new Date(book.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;