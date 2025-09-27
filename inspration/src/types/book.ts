export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  rating?: number;
  readingStatus: 'unread' | 'reading' | 'completed';
  description?: string;
}