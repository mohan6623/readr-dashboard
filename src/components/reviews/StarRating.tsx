import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);
        const isPartiallyFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground',
                interactive && 'transition-colors'
              )}
            />
            {isPartiallyFilled && (
              <Star
                className={cn(
                  sizeClasses[size],
                  'absolute top-0 left-0 fill-amber-400 text-amber-400'
                )}
                style={{
                  clipPath: `inset(0 ${100 - (rating % 1) * 100}% 0 0)`,
                }}
              />
            )}
          </button>
        );
      })}
      {showValue && (
        <span className={cn('font-medium text-foreground ml-1', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
