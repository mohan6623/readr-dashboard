import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Library, Search, Sparkles, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Book Forum
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-primary to-accent">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground">Your Personal Book Haven</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Discover, Share & Track
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Your Reading Journey
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a vibrant community of book lovers. Organize your library, discover new reads, 
            and connect with fellow readers in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8"
            >
              Start Reading Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-background/50">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Library className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organize Your Library</h3>
            <p className="text-muted-foreground">
              Keep all your books in one place with smart categorization and easy search functionality.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Discovery</h3>
            <p className="text-muted-foreground">
              Find your next favorite book with advanced filters and personalized recommendations.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Connect with fellow readers, share reviews, and discover books loved by the community.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 border">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Books Available</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">5K+</div>
              <div className="text-muted-foreground">Active Readers</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Reviews Shared</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
          <TrendingUp className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of readers who've already discovered their perfect book community.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Book Forum</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Book Forum. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
