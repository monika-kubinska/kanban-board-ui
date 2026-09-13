import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { Board } from './pages/board/board';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

const authenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() || inject(Router).parseUrl('/login');
};

const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return !authService.isAuthenticated() || inject(Router).parseUrl('/');
};

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: Board,
    canActivate: [authenticatedGuard],
  },
];
