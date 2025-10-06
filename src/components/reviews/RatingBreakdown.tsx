import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface RatingBreakdownProps {
  breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  totalReviews: number;
}

export const RatingBreakdown = ({ breakdown, totalReviews }: RatingBreakdownProps) => {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = breakdown[stars as keyof typeof breakdown] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm font-medium text-foreground">{stars}</span>
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </div>
            <Progress value={percentage} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
};
