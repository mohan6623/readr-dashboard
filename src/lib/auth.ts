import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/book';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthService {
  private tokenKey = 'book_library_token';
  private userKey = 'book_library_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.email, // Backend expects username
        password: credentials.password
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const token = await response.text(); // Backend returns token as string
    this.setToken(token);
    
    // Create a mock user object since backend doesn't return user info
    const user: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email,
      role: 'user' as 'user' | 'admin' // Default role
    };
    this.setUser(user);
    
    return { token, user };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.email,
        password: userData.password,
        role: 'ROLE_USER'
      }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    // After registration, attempt to login
    return this.login({ email: userData.email, password: userData.password });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();