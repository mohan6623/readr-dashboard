import { BookGrid } from "@/components/BookGrid";
import { sampleBooks } from "@/data/sampleBooks";
import { Book } from "@/types/book";
import { Library, BookOpen } from "lucide-react";

const Index = () => {
  const handleBookClick = (book: Book) => {
    console.log("Selected book:", book);
    // Here you could navigate to a book detail page or open a modal
  };

  const stats = {
    total: sampleBooks.length,
    reading: sampleBooks.filter(book => book.readingStatus === 'reading').length,
    completed: sampleBooks.filter(book => book.readingStatus === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Library className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Library</h1>
                <p className="text-sm text-muted-foreground">Your personal book collection</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Books</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.reading}</div>
                <div className="text-xs text-muted-foreground">Currently Reading</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Welcome back!</h2>
          </div>
          <p className="text-muted-foreground">
            Discover your next great read from your curated collection
          </p>
        </div>

        {/* Book Grid */}
        <BookGrid books={sampleBooks} onBookClick={handleBookClick} />
      </main>
    </div>
  );
};

export default Index;