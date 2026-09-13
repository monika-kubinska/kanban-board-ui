import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { LoginInput, RegisterInput, UserRole } from '../../api/data-contracts';
import { AuthApiService } from './auth-api.service';
import { JwtClaimsService } from './jwt-claims.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly claims = inject(JwtClaimsService);
  private readonly storage = inject(TokenStorageService);
  private readonly token = signal<string | null>(this.storage.token);
  readonly userName = signal(this.storage.userName);
  readonly userEmail = signal(this.storage.userEmail);
  readonly userRole = signal<UserRole | null>(this.storage.userRole);

  login(credentials: LoginInput): Observable<void> {
    return this.authApi.login(credentials).pipe(
        tap((response) => {
          const token = response.token ?? response.accessToken ?? null;
          this.setToken(token);
          this.setUserName(
            response.name ??
              response.username ??
              response.user?.name ??
              response.user?.username ??
              (token ? this.claims.getName(token) : null) ??
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
    return this.authApi.register(credentials);
  }

  setToken(token: string | null): void {
    if (!token) {
      this.removeToken();
      return;
    }

    this.token.set(token);
    this.setUserRole(this.claims.getRole(token));
    this.storage.setToken(token);
  }

  getToken(): string | null {
    return this.token();
  }

  removeToken(): void {
    this.token.set(null);
    this.setUserName(null);
    this.setUserEmail(null);
    this.setUserRole(null);
    this.storage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return this.userRole()?.toLowerCase() === 'admin';
  }

  private setUserName(name: string | null): void {
    this.userName.set(name);
    this.storage.setUserName(name);
  }

  private setUserEmail(email: string | null): void {
    this.userEmail.set(email);
    this.storage.setUserEmail(email);
  }

  private setUserRole(role: UserRole | null): void {
    this.userRole.set(role);
    this.storage.setUserRole(role);
  }
}
