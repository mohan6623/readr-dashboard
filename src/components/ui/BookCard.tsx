import React from 'react';
import { Book } from '@/types/book';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onView?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
  isAdmin?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin = false 
}) => {
  const handleCardClick = () => {
    onView?.(book);
  };

  const handleAdminAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card 
      className="group hover:book-shadow-elevated transition-all duration-300 hover:scale-[1.02] gradient-card border-0 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-3 p-4">
        {/* Small Image */}
        <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold line-clamp-2 text-foreground pr-2">
              {book.title}
            </h3>
            {isAdmin && (
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleAdminAction(e, () => onEdit?.(book))}
                  className="p-1 h-6 w-6"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleAdminAction(e, () => onDelete?.(book))}
                  className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{book.author}</span>
            </div>
            
            <Badge variant="secondary" className="text-xs h-5">
              {book.category}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;