import { Injectable } from '@angular/core';
import { UserRole } from '../../api/data-contracts';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly tokenKey = 'auth_token';
  private readonly userNameKey = 'auth_user_name';
  private readonly userEmailKey = 'auth_user_email';
  private readonly userRoleKey = 'auth_user_role';

  get token(): string | null {
    return this.storage?.getItem(this.tokenKey) ?? null;
  }

  get userName(): string | null {
    return this.storage?.getItem(this.userNameKey) ?? null;
  }

  get userEmail(): string | null {
    return this.storage?.getItem(this.userEmailKey) ?? null;
  }

  get userRole(): UserRole | null {
    return this.storage?.getItem(this.userRoleKey) ?? null;
  }

  setToken(token: string): void {
    this.storage?.setItem(this.tokenKey, token);
  }

  setUserName(name: string | null): void {
    this.setOrRemove(this.userNameKey, name);
  }

  setUserEmail(email: string | null): void {
    this.setOrRemove(this.userEmailKey, email);
  }

  setUserRole(role: UserRole | null): void {
    this.setOrRemove(this.userRoleKey, role);
  }

  clear(): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    storage.removeItem(this.tokenKey);
    storage.removeItem(this.userNameKey);
    storage.removeItem(this.userEmailKey);
    storage.removeItem(this.userRoleKey);
  }

  private setOrRemove(key: string, value: string | null): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    if (value) {
      storage.setItem(key, value);
    } else {
      storage.removeItem(key);
    }
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storage = window.localStorage;
    return typeof storage?.getItem === 'function' &&
      typeof storage.setItem === 'function' &&
      typeof storage.removeItem === 'function'
      ? storage
      : null;
  }
}
