import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { apiURL } from '../../api/config';
import { LoginInput, RegisterInput, UserRole } from '../../api/data-contracts';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  email?: string;
  name?: string;
  username?: string;
  user?: {
    email?: string;
    name?: string;
    username?: string;
  };
}

interface JwtPayload {
  role?: UserRole;
  roles?: UserRole[];
  [claim: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'auth_token';
  private readonly userNameStorageKey = 'auth_user_name';
  private readonly userEmailStorageKey = 'auth_user_email';
  private readonly userRoleStorageKey = 'auth_user_role';
  private readonly token = signal<string | null>(this.readStoredToken());
  readonly userName = signal(this.readStoredUserName());
  readonly userEmail = signal(this.readStoredUserEmail());
  readonly userRole = signal<UserRole | null>(this.readStoredUserRole());

  login(credentials: LoginInput): Observable<void> {
    return this.http
      .post<LoginResponse>(`${apiURL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          const token = response.token ?? response.accessToken ?? null;
          this.setToken(token);
          this.setUserName(
            response.name ??
              response.username ??
              response.user?.name ??
              response.user?.username ??
              (token ? this.readNameFromToken(token) : null) ??
              'Użytkownik',
          );
              this.setUserEmail(response.email ?? response.user?.email ?? credentials.email);
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
    this.setUserRole(this.readRoleFromToken(token));
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
    this.setUserEmail(null);
    this.setUserRole(null);
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

  private setUserEmail(email: string | null): void {
    this.userEmail.set(email);
    if (typeof window !== 'undefined') {
      if (email) {
        window.localStorage.setItem(this.userEmailStorageKey, email);
      } else {
        window.localStorage.removeItem(this.userEmailStorageKey);
      }
    }
  }

  private readStoredUserEmail(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.userEmailStorageKey);
  }

  private setUserRole(role: UserRole | null): void {
    this.userRole.set(role);
    if (typeof window !== 'undefined') {
      if (role) {
        window.localStorage.setItem(this.userRoleStorageKey, role);
      } else {
        window.localStorage.removeItem(this.userRoleStorageKey);
      }
    }
  }

  private readStoredUserRole(): UserRole | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.userRoleStorageKey);
  }

  private readRoleFromToken(token: string): UserRole | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload;
      const roleClaim = decodedPayload.role ?? decodedPayload.roles?.[0];
      const schemaRole = Object.entries(decodedPayload).find(([claim]) => claim.endsWith('/role'))?.[1];

      return typeof roleClaim === 'string'
        ? roleClaim
        : typeof schemaRole === 'string'
          ? schemaRole
          : null;
    } catch {
      return null;
    }
  }

  private readNameFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload;
      const nameClaim = decodedPayload['name'] ?? decodedPayload['given_name'] ?? decodedPayload['preferred_username'];
      const schemaName = Object.entries(decodedPayload).find(([claim]) => claim.endsWith('/name'))?.[1];

      return typeof nameClaim === 'string'
        ? nameClaim
        : typeof schemaName === 'string'
          ? schemaName
          : null;
    } catch {
      return null;
    }
  }
}
