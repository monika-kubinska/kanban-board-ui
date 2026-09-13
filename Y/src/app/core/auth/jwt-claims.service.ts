import { Injectable } from '@angular/core';
import { UserRole } from '../../api/data-contracts';

interface JwtPayload {
  role?: UserRole;
  roles?: UserRole[];
  [claim: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class JwtClaimsService {
  getRole(token: string): UserRole | null {
    const payload = this.readPayload(token);
    const roleClaim = payload?.role ?? payload?.roles?.[0];
    const schemaRole = Object.entries(payload ?? {}).find(([claim]) => claim.endsWith('/role'))?.[1];
    const role = typeof roleClaim === 'string' ? roleClaim : schemaRole;

    return typeof role === 'string' ? role : null;
  }

  getName(token: string): string | null {
    const payload = this.readPayload(token);
    const nameClaim = payload?.['name'] ?? payload?.['given_name'] ?? payload?.['preferred_username'];
    const schemaName = Object.entries(payload ?? {}).find(([claim]) => claim.endsWith('/name'))?.[1];
    const name = typeof nameClaim === 'string' ? nameClaim : schemaName;

    return typeof name === 'string' ? name : null;
  }

  private readPayload(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload;
    } catch {
      return null;
    }
  }
}
