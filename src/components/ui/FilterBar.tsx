import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface FilterBarProps {
  authors: string[];
  categories: string[];
  selectedAuthor: string | null;
  selectedCategory: string | null;
  onAuthorChange: (author: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  authors,
  categories,
  selectedAuthor,
  selectedCategory,
  onAuthorChange,
  onCategoryChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedAuthor || selectedCategory;

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4" />
        Filters:
      </div>
      
      <Select value={selectedAuthor || 'all'} onValueChange={(value) => onAuthorChange(value === 'all' ? null : value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select Author" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Authors</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author} value={author}>
              {author}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedCategory || 'all'} onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-3 w-3" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;