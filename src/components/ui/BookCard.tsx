import React from 'react';
import { Book } from '@/types/book';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  isAdmin?: boolean;
  viewMode?: 'grid' | 'list';
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin = false,
  viewMode = 'grid'
}) => {
  const handleCardClick = () => {
    onView?.(book);
  };

  const handleAdminAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Mock rating - in real app this would come from book data
  const rating = 4.0 + Math.random() * 0.9; // Mock rating between 4.0-4.9

  if (viewMode === 'list') {
    return (
      <div className="group cursor-pointer" onClick={handleCardClick}>
        <Card className="flex items-center gap-4 p-4 hover:book-shadow-elevated transition-all duration-300">
          {/* Book Cover */}
          <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded book-shadow">
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
          
          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground truncate mb-1">
                  {book.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {book.author}
                </p>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-muted-foreground text-xs">{rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              {/* Admin Actions */}
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleAdminAction(e, () => onEdit?.(book))}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleAdminAction(e, () => onDelete?.(book))}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <Card className="relative overflow-hidden border-0 bg-transparent">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg book-shadow group-hover:book-shadow-elevated transition-all duration-300">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {book.category}
            </Badge>
          </div>
          
          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-md px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
          
          {/* Admin Actions */}
          {isAdmin && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleAdminAction(e, () => onEdit?.(book))}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleAdminAction(e, () => onDelete?.(book))}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Book Info */}
        <div className="pt-3">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {book.author}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default BookCard;