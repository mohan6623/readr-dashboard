import React from 'react';
import { Book } from '@/types/book';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  isAdmin?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  viewMode?: 'grid' | 'list';
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  onView,
  onEdit,
  onDelete,
  isAdmin = false,
  loading = false,
  emptyMessage = "No books found",
  viewMode = 'grid'
}) => {
  if (loading) {
    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        : "space-y-4"
      }>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            {viewMode === 'grid' ? (
              <>
                <div className="aspect-[3/4] bg-muted rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </>
            ) : (
              <div className="flex gap-4 p-4 bg-card rounded-lg">
                <div className="w-16 h-20 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {emptyMessage}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {isAdmin 
            ? "Start building your library by adding some books."
            : "Check back later for new additions to the collection."
          }
        </p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      : "space-y-4"
    }>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdmin={isAdmin}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default BookGrid;