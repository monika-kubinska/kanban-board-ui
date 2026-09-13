import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Team } from '../../api/data-contracts';
import { CreateTeamForm } from '../teams/create-team-form';
import { TeamsService } from '../teams/teams.service';

@Component({
  selector: 'app-account',
  imports: [CreateTeamForm],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly authService = inject(AuthService);
  private readonly teamsService = inject(TeamsService);

  readonly userName = this.authService.userName;
  readonly userEmail = this.authService.userEmail;
  readonly userRole = this.authService.userRole;
  readonly teams = signal<Team[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly creatingTeam = signal(false);
  readonly createTeamError = signal('');

  constructor() {
    this.loadTeams();
  }

  createTeam(name: string): void {
    if (this.creatingTeam()) {
      return;
    }

    this.creatingTeam.set(true);
    this.createTeamError.set('');

    this.teamsService.createTeam({ name }).subscribe({
      next: () => {
        this.creatingTeam.set(false);
        this.loadTeams();
      },
      error: () => {
        this.createTeamError.set('Nie udało się utworzyć zespołu.');
        this.creatingTeam.set(false);
      },
    });
  }

  private loadTeams(): void {
    this.loading.set(true);
    this.teamsService.getTeams().subscribe({
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
