import { Book } from "@/types/book";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
}

export const BookCard = ({ book, onBookClick }: BookCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border bg-card hover:bg-book-hover transition-all duration-300 hover:shadow-lg hover:shadow-book-shadow/20 hover:-translate-y-1"
      onClick={() => onBookClick?.(book)}
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur-sm">
            {book.genre}
          </Badge>
        </div>
        {book.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="text-xs font-medium">{book.rating}</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 text-card-foreground">{book.title}</h3>
        <p className="text-muted-foreground text-xs">{book.author}</p>
        <Badge 
          variant={book.readingStatus === 'completed' ? 'default' : 
                  book.readingStatus === 'reading' ? 'secondary' : 'outline'}
          className="text-xs capitalize"
        >
          {book.readingStatus}
        </Badge>
      </div>
    </Card>
  );
};