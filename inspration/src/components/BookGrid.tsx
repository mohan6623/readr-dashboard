import { Book } from "@/types/book";
import { BookCard } from "./BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import { useState } from "react";

interface BookGridProps {
  books: Book[];
  onBookClick?: (book: Book) => void;
}

export const BookGrid = ({ books, onBookClick }: BookGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique genres
  const genres = Array.from(new Set(books.map(book => book.genre)));

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="p-2"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setViewMode('list')}
            className="p-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Badge 
          variant={selectedGenre === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedGenre(null)}
        >
          All
        </Badge>
        {genres.map(genre => (
          <Badge
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
      </p>

      {/* Book Grid */}
      <div 
        className={
          viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "space-y-4"
        }
      >
        {filteredBooks.map(book => (
          <BookCard 
            key={book.id} 
            book={book} 
            onBookClick={onBookClick}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("");
              setSelectedGenre(null);
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};