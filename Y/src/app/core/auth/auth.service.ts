import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'auth_token';

  setToken(token: string | null): void {
    if (!token) {
      this.removeToken();
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, token);
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.storageKey);
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
