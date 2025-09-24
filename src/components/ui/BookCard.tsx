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
  return (
    <Card className="group hover:book-shadow-elevated transition-all duration-300 hover:scale-[1.02] gradient-card border-0 overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden">
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
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground">
          {book.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-1" />
          <span className="truncate">{book.author}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 mb-4 text-sm leading-relaxed">
          {book.description}
        </CardDescription>
        
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(book)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(book)}
                className="px-3"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(book)}
                className="px-3 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;