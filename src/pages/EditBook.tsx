import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Book, BookFormData } from '@/types/book';
import { bookService } from '@/lib/api';
import Navigation from '@/components/layout/Navigation';
import BookForm from '@/components/admin/BookForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const EditBook = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    if (id) {
      loadBook();
    }
  }, [isAdmin, id, navigate]);

  const loadBook = async () => {
    if (!id) return;
    
    try {
      setInitialLoading(true);
      const fetchedBook = await bookService.getBookById(id);
      setBook(fetchedBook);
    } catch (error) {
      toast({
        title: "Error loading book",
        description: "Failed to load book details. Please try again.",
        variant: "destructive",
      });
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (formData: BookFormData) => {
    if (!id) return;
    
    try {
      setLoading(true);
      await bookService.updateBook(id, formData);
      
      toast({
        title: "Book updated successfully!",
        description: `"${formData.title}" has been updated.`,
      });
      
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Failed to update book",
        description: "There was an error updating the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (initialLoading) {
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
            <Button onClick={() => navigate('/admin')}>
              Back to Admin Panel
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
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Panel
          </Button>
        </div>

        <BookForm
          book={book}
          onSubmit={handleSubmit}
          loading={loading}
          title="Edit Book"
          description="Update the book details below"
        />
      </main>
    </div>
  );
};

export default EditBook;