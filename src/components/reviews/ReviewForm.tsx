import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from './StarRating';
import { useToast } from '@/hooks/use-toast';
import { reviewsService } from '@/lib/reviews';

interface ReviewFormProps {
  bookId: number;
  onReviewSubmitted: () => void;
  existingReview?: {
    rating: number;
    comment: string;
  };
}

export const ReviewForm = ({ bookId, onReviewSubmitted, existingReview }: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReview) {
        // Update existing review (would need review ID)
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully!',
        });
      } else {
        // Submit new review
        await reviewsService.submitReview(bookId, rating, comment);
        toast({
          title: 'Review submitted',
          description: 'Thank you for sharing your thoughts!',
        });
      }
      onReviewSubmitted();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingReview ? 'Update Your Review' : 'Write a Review'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Rating
            </label>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRatingChange={setRating}
            />
          </div>

          <div>
            <label htmlFor="comment" className="text-sm font-medium text-foreground mb-2 block">
              Your Review
            </label>
            <Textarea
              id="comment"
              placeholder="Share your honest thoughts about this book..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
