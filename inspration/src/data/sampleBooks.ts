import { Book } from "@/types/book";
import book1 from "@/assets/book1.jpg";
import book2 from "@/assets/book2.jpg"; 
import book3 from "@/assets/book3.jpg";
import book4 from "@/assets/book4.jpg";

export const sampleBooks: Book[] = [
  {
    id: "1",
    title: "The Art of Living",
    author: "Marcus Aurelius", 
    cover: book1,
    genre: "Philosophy",
    rating: 4.8,
    readingStatus: "completed",
    description: "Timeless wisdom on living a meaningful life through stoic philosophy and practical guidance."
  },
  {
    id: "2", 
    title: "Midnight Tales",
    author: "Sarah Chen",
    cover: book2,
    genre: "Mystery",
    rating: 4.2,
    readingStatus: "reading",
    description: "A collection of haunting stories that blur the line between reality and the supernatural."
  },
  {
    id: "3",
    title: "Digital Dreams", 
    author: "Alex Rivera",
    cover: book3,
    genre: "Sci-Fi",
    rating: 4.5,
    readingStatus: "unread",
    description: "An exploration of consciousness in the digital age and what it means to be human."
  },
  {
    id: "4",
    title: "Garden of Hearts",
    author: "Emma Thompson",
    cover: book4, 
    genre: "Romance",
    rating: 4.0,
    readingStatus: "completed",
    description: "A tender story of love blooming in unexpected places, set against the backdrop of a secret garden."
  },
  {
    id: "5",
    title: "The Last Algorithm", 
    author: "Dr. James Wright",
    cover: book3, // Reusing for demo
    genre: "Sci-Fi", 
    rating: 4.7,
    readingStatus: "reading",
    description: "When AI becomes sentient, humanity must face its greatest challenge yet."
  },
  {
    id: "6",
    title: "Whispers in the Wind",
    author: "Maria Santos", 
    cover: book1, // Reusing for demo
    genre: "Poetry",
    rating: 4.3,
    readingStatus: "unread",
    description: "A beautiful collection of verses that capture the essence of human emotion and nature."
  },
  {
    id: "7",
    title: "The Forgotten Kingdom",
    author: "Robert Blake",
    cover: book2, // Reusing for demo  
    genre: "Fantasy",
    rating: 4.6,
    readingStatus: "completed",
    description: "An epic tale of magic, courage, and the battle between light and darkness."
  },
  {
    id: "8", 
    title: "Modern Mindfulness",
    author: "Dr. Lisa Park",
    cover: book4, // Reusing for demo
    genre: "Self-Help",
    rating: 4.1,
    readingStatus: "reading",
    description: "Practical techniques for finding peace and presence in our busy modern world."
  }
];