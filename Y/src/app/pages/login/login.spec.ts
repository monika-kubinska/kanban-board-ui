import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../core/auth/auth.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report whether the user is authenticated', () => {
    const authService = TestBed.inject(AuthService);

    expect(component.isAuthenticated()).toBeFalsy();

    authService.setToken('sample-token');

    expect(component.isAuthenticated()).toBeTruthy();
  });
});
