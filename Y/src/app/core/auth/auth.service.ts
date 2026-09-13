import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { apiURL } from '../../api/config';
import { LoginInput, RegisterInput } from '../../api/data-contracts';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  name?: string;
  username?: string;
  user?: {
    name?: string;
    username?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'auth_token';
  private readonly userNameStorageKey = 'auth_user_name';
  private readonly token = signal<string | null>(this.readStoredToken());
  readonly userName = signal(this.readStoredUserName());

  login(credentials: LoginInput): Observable<void> {
    return this.http
      .post<LoginResponse>(`${apiURL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token ?? response.accessToken ?? null);
          this.setUserName(
            response.name ??
              response.username ??
              response.user?.name ??
              response.user?.username ??
              'Użytkownik',
          );
        }),
        tap({
          error: () => this.removeToken(),
        }),
        map(() => undefined),
      );
  }

  register(credentials: RegisterInput): Observable<void> {
    return this.http
      .post(`${apiURL}/auth/register`, credentials, { responseType: 'text' })
      .pipe(map(() => undefined));
  }

  setToken(token: string | null): void {
    if (!token) {
      this.removeToken();
      return;
    }

    this.token.set(token);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, token);
    }
  }

  getToken(): string | null {
    return this.token();
  }

  removeToken(): void {
    this.token.set(null);
    this.setUserName(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  private readStoredToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.storageKey);
  }

  private setUserName(name: string | null): void {
    this.userName.set(name);
    if (typeof window !== 'undefined') {
      if (name) {
        window.localStorage.setItem(this.userNameStorageKey, name);
      } else {
        window.localStorage.removeItem(this.userNameStorageKey);
      }
    }
  }

  private readStoredUserName(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.userNameStorageKey);
  }
}
