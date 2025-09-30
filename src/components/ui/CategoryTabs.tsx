import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground flex-shrink-0">
        <Filter className="h-4 w-4" />
      </div>
      <div className="flex flex-nowrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;