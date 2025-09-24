import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters } from '@/types/book';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  initialFilters?: SearchFilters;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  loading = false, 
  initialFilters = {} 
}) => {
  const [query, setQuery] = useState(initialFilters.query || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [author, setAuthor] = useState(initialFilters.author || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch({
      query: query.trim() || undefined,
      category: category || undefined,
      author: author.trim() || undefined,
    });
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setAuthor('');
    onSearch({});
  };

  const hasActiveFilters = query || category || author;

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books by title, author, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button 
          type="button"
          variant="outline" 
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 ${showFilters ? 'bg-accent' : ''}`}
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          disabled={loading}
          className="px-6"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4 border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-foreground">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="science-fiction">Science Fiction</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="biography">Biography</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="self-help">Self Help</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Author</label>
              <Input
                type="text"
                placeholder="Filter by author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSearch} disabled={loading}>
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;