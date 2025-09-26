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
    <div className="mb-8">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground flex-shrink-0">
          <Filter className="h-4 w-4" />
        </div>
        
        <div className="flex gap-2">
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
    </div>
  );
};

export default CategoryTabs;