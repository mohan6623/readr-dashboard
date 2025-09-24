import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookFormData } from '@/types/book';
import { bookService } from '@/lib/api';
import Navigation from '@/components/layout/Navigation';
import BookForm from '@/components/admin/BookForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AddBook = () => {
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (formData: BookFormData) => {
    try {
      setLoading(true);
      await bookService.createBook(formData);
      
      toast({
        title: "Book added successfully!",
        description: `"${formData.title}" has been added to the library.`,
      });
      
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Failed to add book",
        description: "There was an error adding the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
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
          onSubmit={handleSubmit}
          loading={loading}
          title="Add New Book"
          description="Fill in the details to add a new book to your library"
        />
      </main>
    </div>
  );
};

export default AddBook;