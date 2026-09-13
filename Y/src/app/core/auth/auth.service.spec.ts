import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    if (typeof localStorage.clear === 'function') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and return a token', () => {
    service.setToken('sample-token');

    expect(service.getToken()).toBe('sample-token');
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should remove token and mark user as unauthenticated', () => {
    service.setToken('sample-token');
    service.removeToken();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should recognize admin role regardless of casing', () => {
    service.setToken('header.eyJyb2xlIjoiYWRtaW4ifQ.signature');

    expect(service.isAdmin()).toBeTruthy();
  });
});
