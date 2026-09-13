import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, Routes } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { TeamsService } from './pages/teams/teams.service';
import { Board } from './pages/board/board';
import { Account } from './pages/account/account';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Teams } from './pages/teams/teams';

const authenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() || inject(Router).parseUrl('/login');
};

const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return !authService.isAuthenticated() || inject(Router).parseUrl('/');
};

const teamMemberGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const teamId = route.paramMap.get('teamId');

  if (!teamId) {
    return router.parseUrl('/');
  }

  return inject(TeamsService).getTeams().pipe(
    map((teams) => teams.some((team) => team.id === teamId) || router.parseUrl('/')),
    catchError(() => of(router.parseUrl('/'))),
  );
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
    path: 'account',
    component: Account,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'teams',
    component: Teams,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'boards/:teamId',
    component: Board,
    canActivate: [authenticatedGuard, teamMemberGuard],
  },
  {
    path: 'backlog/:teamId',
    component: Board,
    data: { view: 'backlog' },
    canActivate: [authenticatedGuard, teamMemberGuard],
  },
  {
    path: '',
    component: Board,
    canActivate: [authenticatedGuard],
  },
];
