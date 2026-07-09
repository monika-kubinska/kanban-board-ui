import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
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
});
