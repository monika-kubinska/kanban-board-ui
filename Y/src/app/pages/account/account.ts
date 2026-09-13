import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { AccountService } from './account.service';
import { Team } from '../../api/data-contracts';

@Component({
  selector: 'app-account',
  imports: [],
  providers: [AccountService],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly authService = inject(AuthService);
  private readonly accountService = inject(AccountService);

  readonly userName = this.authService.userName;
  readonly userEmail = this.authService.userEmail;
  readonly userRole = this.authService.userRole;
  readonly teams = signal<Team[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    this.accountService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać listy zespołów.');
        this.loading.set(false);
      },
    });
  }
}
