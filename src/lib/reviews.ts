import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/book';

export const reviewsService = {
  async getBookReviews(bookId: number): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async submitReview(bookId: number, rating: number, comment: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to submit a review');
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        book_id: bookId,
        user_id: user.id,
        rating,
        comment,
      });

    if (error) throw error;
  },

  async updateReview(reviewId: string, rating: number, comment: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({ rating, comment })
      .eq('id', reviewId);

    if (error) throw error;
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  },

  async getBookRatingStats(bookId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('book_id', bookId);

    if (error) throw error;

    const reviews = data || [];
    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        avgRating: 0,
        totalReviews: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const breakdown = reviews.reduce((acc, review) => {
      acc[review.rating as 1 | 2 | 3 | 4 | 5] = (acc[review.rating as 1 | 2 | 3 | 4 | 5] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { 1: number; 2: number; 3: number; 4: number; 5: number });

    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    return {
      avgRating,
      totalReviews,
      breakdown,
    };
  },

  async getUserReviewForBook(bookId: number): Promise<Review | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', bookId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
