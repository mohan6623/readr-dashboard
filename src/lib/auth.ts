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
        username: credentials.username,
        password: credentials.password
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }

    const data = await response.json();
    const token = data.token;
    
    // Decode JWT to extract user information
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user: User = {
      id: payload.sub || payload.userId || 0,
      name: payload.username || credentials.username,
      email: payload.email || '',
      role: payload.role || 'ROLE_USER'
    };

    this.setToken(token);
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
        username: userData.username,
        password: userData.password
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
    }

    // After successful registration, automatically login
    return this.login({ username: userData.username, password: userData.password });
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
    return user?.role === 'ROLE_ADMIN';
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) return {};
    
    // Only send the Authorization header, nothing else
    return { 
      'Authorization': `Bearer ${token}`
    };
  }
}

export const authService = new AuthService();